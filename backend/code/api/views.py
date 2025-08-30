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
def request_locations(request):
    if request.method == "GET":
        locs = dict()
        locs['train_locations'] = get_locs()
        print(locs)
        return JsonResponse(locs)