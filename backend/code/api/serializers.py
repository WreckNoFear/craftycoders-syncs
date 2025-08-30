from rest_framework import serializers
from .models import TripInfo, CarbonFootprint, CrowdSourcedData, Train

class TripInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TripInfo
        fields = '__all__'

class TrainSerializer(serializers.ModelSerializer):
    class Meta:
        model = Train
        fields = '__all__'