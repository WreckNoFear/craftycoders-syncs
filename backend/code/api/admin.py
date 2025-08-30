from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import TripInfo, Train, CarbonFootprint, CrowdSourcedData

admin.site.register(TripInfo)
admin.site.register(Train)
admin.site.register(CarbonFootprint)
admin.site.register(CrowdSourcedData)