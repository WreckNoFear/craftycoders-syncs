from TransportNSWv2 import TransportNSWv2

from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth import login, authenticate, logout
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.authtoken.models import Token

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
def CarbonFootprint(request):
    if request.method == "POST":
        data = json.loads(request.body)
        trip = data.get("trip")
        transport_type = data.get("trip.origin_transport_type")
        distance_km = data.get("distance_km")
        if transport_type == "train":
            carbon_emissions_transport_kg = distance_km * 0.04  # 0.04 kg CO2 per km for trains
        elif transport_type == "metro":
            carbon_emissions_transport_kg = distance_km * 0.00  # 0.00 kg CO2 per km for metro
        else:
            carbon_emissions_transport_kg = distance_km * 0.1   # Default value
        carbon_emissions_car_kg = distance_km * 0.17  # 0.17 kg CO2 per km for cars (diesel)
        return JsonResponse({"message": "Carbon footprint created"})

        