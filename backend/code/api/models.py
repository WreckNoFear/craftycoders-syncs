from django.db import models

# Create your models here.

class TripInfo(models.Model):
    """Trip info

    """
    due = models.IntegerField()
    origin_stop_id = models.CharField(max_length=200)
    origin_name = models.CharField(max_length=200)
    departure_time = models.DateTimeField()
    destination_stop_id = models.CharField(max_length=200)
    destination_name = models.CharField(max_length=200)
    arrival_time = models.DateTimeField()
    origin_transport_type = models.CharField(max_length=200)
    origin_transport_name = models.CharField(max_length=200)
    origin_line_name = models.CharField(max_length=200)
    origin_line_name_short = models.CharField(max_length=200)
    changes = models.IntegerField()
    occupancy = models.CharField(max_length=200)
    real_time_trip_id = models.CharField(max_length=200, primary_key=True)
    latitude = models.CharField(max_length=200)
    longitude = models.CharField(max_length=200)

class Train(models.Model):
    #prolly should put more here idk
    #id of some sort...
    # NOTE: CHANGED FROM CHARFIELD TO DECIMALFIELD FOR LONGITUDE AND LATITUDE. 
    latitude = models.DecimalField(max_digits=6, decimal_places=4)
    longitude = models.DecimalField(max_digits=6, decimal_places=4)


class CarbonFootprint(models.Model):
    trip = models.ForeignKey(TripInfo, on_delete=models.CASCADE, related_name='carbon_footprints')
    distance_km = models.DecimalField(max_digits=8, decimal_places=2)
    carbon_emissions_kg = models.DecimalField(max_digits=8, decimal_places=2)
# need a hardcoded calculation for carbon emissions

class CrowdsourcedData(models.Model):
    trip = models.ForeignKey(TripInfo, on_delete=models.CASCADE, related_name='crowdsourced_data')
    comments = models.CharField(max_length=200) # includes train guard annoucements
    transport_officer = models.BooleanField(default=False) #lol
    is_delay = models.BooleanField(default=False)
    cleanliness = models.IntegerField(default=5)
    crowdedness = models.IntegerField(default=5)
    carriage_number = models.CharField(max_length=4, min_length=4)
    # can add more later.