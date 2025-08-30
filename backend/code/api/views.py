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
tnsw = TransportNSWv2()
from .models import TripInfo, CarbonFootprint, CrowdSourcedData


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

def get_locs():
    url = "https://api.transport.nsw.gov.au/v1/gtfs/vehiclepos/buses"

    headers = {
        "Authorization": f"apikey {API_KEY}"
    }

    feed = gtfs_realtime_pb2.FeedMessage()
    response = requests.get("https://api.transport.nsw.gov.au/v2/gtfs/vehiclepos/sydneytrains", headers=headers)
    feed.ParseFromString(response.content)
    out_list = []
    for entity in feed.entity:
        if entity.HasField("vehicle"):
            vp = entity.vehicle
            print(f"Vehicle {vp.vehicle.id}: {vp.position.latitude}, {vp.position.longitude}")
            out_list.append({"latitude": vp.position.latitude, "longitude":vp.position.longitude})
    return out_list


@csrf_exempt
def request_trips(request):
    if request.method == "POST":
        data = json.loads(request.body)
        start = data.get("start_id")
        end = data.get("end_id")
        journey = tnsw.get_trip(start, end, API_KEY, 5)
        out = json.loads(journey)
        return JsonResponse(out)

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

#         CarbonFootprint.objects.create(
#             trip=trip,
#             distance_km=distance_km,
#             carbon_emissions_transport_kg=carbon_emissions_transport_kg,
#             carbon_emissions_car_kg=carbon_emissions_car_kg
#         )
#         return JsonResponse({"message": "Carbon footprint created"})
# >>>>>>> fac9e1f4d7fcd6ec8ece2ce11ec07fe75a330c52

@csrf_exempt 
def CrowdSourcedData(request):
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
        locs['train_locations'] = get_locs()
        print(locs)
        return JsonResponse(locs)