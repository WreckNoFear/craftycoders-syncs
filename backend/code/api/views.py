from TransportNSWv2 import TransportNSWv2

from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth import login, authenticate, logout
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.authtoken.models import Token
import requests
from google.transit import gtfs_realtime_pb2

from rest_framework.views import APIView
import json
from nextstop.settings import API_KEY
import requests
import time
from datetime import datetime
import json
tnsw = TransportNSWv2()
from .models import TripInfo, CarbonFootprint, CrowdSourcedData, Train, TripLeg, TripPoint
from django.utils.dateparse import parse_datetime

def index(request):
    return HttpResponse("Hello, world. You're at the api index.")


# views.py
@csrf_exempt
def register_user(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data.get("username")
        first_name = data.get("first_name")
        password = data.get("password")

        if User.objects.filter(username=username).exists():
            return JsonResponse({"error": "Username already taken"}, status=400)
        user = User.objects.create_user(username=username, password=password, first_name=first_name)
        token, created = Token.objects.get_or_create(user=user)

        return JsonResponse({"token": token.key})

def vehicle_info_retrieve(end):
    headers = {
        "Authorization": f"apikey {API_KEY}"
    }

    feed = gtfs_realtime_pb2.FeedMessage()
    response = requests.get("https://api.transport.nsw.gov.au/v2/gtfs/vehiclepos/" + end, headers=headers)
    feed.ParseFromString(response.content)

    out_list = []
    for entity in feed.entity:
        if entity.HasField("vehicle"):
            vp = entity.vehicle
            if end == "metro":
                vehicle = "metro"
            elif end == "sydneytrains":
                vehicle = "train"
            else:
                vehicle = "unknown"
            out_list.append({"trip_id": vp.trip.trip_id, "latitude": vp.position.latitude, "longitude":vp.position.longitude, 'vehicle':vehicle})
    return out_list

def get_train_and_metro_data():
    out_list = vehicle_info_retrieve('sydneytrains')
    out_list.extend(vehicle_info_retrieve('metro'))
    return out_list


@csrf_exempt
def request_trips(request):
    if request.method == "POST":
        data = json.loads(request.body)
        origin = data.get("start_id")
        destination = data.get("end_id")
        # API endpoint
        api_endpoint = "https://api.transport.nsw.gov.au/v1/tp/trip"

        # Input parameters for the search
        when = time.time()

        # Build the request parameters
        params = {
            "outputFormat": "rapidJSON",
            "coordOutputFormat": "EPSG:4326",
            "depArrMacro": "dep",
            "itdDate": datetime.fromtimestamp(when).strftime("%Y%m%d"),
            "itdTime": datetime.fromtimestamp(when).strftime("%H%M"),
            "type_origin": "stop",
            "name_origin": origin,
            "type_destination": "stop",
            "name_destination": destination,
            "TfNSWTR": "true"
        }

        # If you have an API key, include it in headers
        headers = {
            "Authorization": "apikey " + API_KEY
        }

        response = requests.get(api_endpoint, params=params, headers=headers)

        # Parse the JSON response


        info = response.json()

        out_dict = {}
        out_dict["journeys"] = []

        for journey in info['journeys']:
            out_journey = {}
            out_journey["legs"] = []
            travel_time = 0

            for leg in journey['legs']:
                out_leg = {}
                transportation_method = leg['transportation']['product']['class']
                if transportation_method == 2:
                    out_leg['transport'] = "Metro"
                elif transportation_method == 1:
                    out_leg['transport'] = "Train"
                else:
                    continue
                out_leg['trip_id'] = leg['transportation']['properties'].get('AVMSTripID', 'RealtimeTripId')
                
                coords = leg['origin']['coord']
                out_leg['origin'] = {'latitude':coords[0], 'longitude':coords[1]}
                
                coords2 = leg['destination']['coord']
                out_leg['destination'] = {'latitude':coords2[0], 'longitude':coords2[1]}
                
                travel_time += leg['duration']

                path = [{'latitude':x[0],'longitude':x[1]} for x in leg['coords']]
                out_leg['path'] = path
                out_journey['legs'].append(out_leg)
                
                # Lookup or create the Train
                trip_id = leg['transportation']['properties'].get('AVMSTripID', 'RealtimeTripId')
                train_obj, _ = Train.objects.get_or_create(
                    trip_id=trip_id,
                    defaults={
                        "vehicle": "Train" if transportation_method == 1 else "Metro",
                        "current_latitude": leg['origin']['coord'][0],
                        "current_longitude": leg['origin']['coord'][1]
                    }
                )
                start_coords = leg['origin']['coord']
                end_coords = leg['destination']['coord']

                trip_leg = TripLeg.objects.create(
                    train=train_obj,
                    start_latitude=float(start_coords[0]),
                    start_longitude=float(start_coords[1]),
                    end_latitude=float(end_coords[0]),
                    end_longitude=float(end_coords[1]),
                    path = path
                )

            if len(out_journey['legs']) == 0:
                continue
            last_stop = journey['legs'][-1]['stopSequence'][-1]

            arrival_time = last_stop.get('arrivalTimeEstimated', last_stop['arrivalTimePlanned'])

            first_stop = journey['legs'][0]['stopSequence'][0]
            departure_time = first_stop.get('departureTimeEstimated', first_stop['departureTimePlanned'])


            out_journey["travel_time"] = travel_time
            out_journey["departure_time"] = departure_time
            out_journey["arrival_time"] = arrival_time

            trip_info = TripInfo.objects.create(
                duration=out_journey['travel_time'],  # or your accumulated travel_time if better
                start_time=parse_datetime(departure_time),
                end_time=parse_datetime(arrival_time),
                start_station=journey['legs'][0]['origin']['name'],
                end_station=journey['legs'][-1]['destination']['name']
            )


            out_dict["journeys"].append(out_journey)
        return JsonResponse(out_dict)

@csrf_exempt
def set_carbonfootprint(request):
    """
    Method calculates and sets the CarbonFootprint entity for a 
    particular trip based on distance and transport type.
    """
    if request.method == "POST":
        data = json.loads(request.body)
        trip_id = data.get("trip")

        try:
            trip = TripInfo.objects.get(real_time_trip_id=trip_id)
            transport_type = trip.origin_transport_type
            distance_km = data.get("distance_km")
        except TripInfo.DoesNotExist:
            return JsonResponse({"error": "TripInfo not found for carbon footprint"}, status=404)

        # Get emissions savings by getting difference between public transport to car
        # We hard coded values for now
        # Can be expanded later on to include other transport types and conditions to improve accuracy
        if transport_type == "Train":
            carbon_emissions_transport_kg = distance_km * 0.04  # 0.04 kg CO2 per km for trains
        elif transport_type == "Metro":
            carbon_emissions_transport_kg = distance_km * 0.00  # 0.00 kg CO2 per km for metro
        else:
            carbon_emissions_transport_kg = distance_km * 0.1   # Default value
    
        carbon_emissions_car_kg = distance_km * 0.17  # 0.17 kg CO2 per km for cars (diesel)
        carbon_emissions_saved_kg = carbon_emissions_car_kg - carbon_emissions_transport_kg
        cf, created = CarbonFootprint.objects.get_or_create(trip=trip)
        cf.distance_km = distance_km # could be changed so that we automatically calulate - alex
        cf.carbon_emissions_saved_kg = carbon_emissions_saved_kg
        cf.save()

        return JsonResponse({
            "message": "Carbon footprint successfully updated.",
            "carbon_emissions_saved_kg": carbon_emissions_saved_kg,
            })


@csrf_exempt 
def retrieve_crowdsourcedata(request):
    if request.method == "POST":
        data = json.loads(request.body)
        trip_id = data.get("trip")
        try:
            trip = TripInfo.objects.get(real_time_trip_id=trip_id)  # Use real_time_trip_id
        except TripInfo.DoesNotExist:
            return JsonResponse({"error": "Trip not found"}, status=404)
        comments = data.get("comments")
        transport_officer = data.get("transport_officer")
        is_delay = data.get("is_delay")
        cleanliness = data.get("cleanliness")
        crowdedness = data.get("crowdedness")
        carriage_number = data.get("carriage_number")
        CrowdSourcedData.objects.create(
            trip=trip, 
            comments=comments, 
            transport_officer=transport_officer, 
            is_delay=is_delay, 
            cleanliness=cleanliness, 
            crowdedness=crowdedness, 
            carriage_number=carriage_number)
        return JsonResponse({"message": "CrowdSourcedData created"})


@csrf_exempt
def request_locations(request):
    if request.method == "GET":
        locs = dict()
        train_data = get_train_and_metro_data()
        print(train_data)
        locs['train_info'] = train_data
        # Save each train into DB (create or update if exists)
        for train in train_data:
            trip_id = train.get("trip_id")
            vehicle = train.get("vehicle")
            lat = train.get("latitude")
            lon = train.get("longitude")
            if trip_id and lat is not None and lon is not None:
                Train.objects.update_or_create(
                    trip_id=trip_id,
                    defaults={
                        "vehicle": vehicle,
                        "current_latitude": float(lat),
                        "current_longitude": float(lon),
                    }
                )
        return JsonResponse(locs)