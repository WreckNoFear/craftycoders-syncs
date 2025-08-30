from rest_framework import serializers
from .models import TripInfo, CarbonFootprint, CrowdSourcedData

class TripInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TripInfo
        fields = '__all__'