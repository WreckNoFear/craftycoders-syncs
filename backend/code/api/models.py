from django.db import models
from django.core.validators import MinLengthValidator

# Create your models here.

class TripInfo(models.Model):
    """
    TripInfo represents data retrieved by the TransportNSW API.
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
    """
    CarbonFootprint represents environmental data about a particular trip.

    It links back to TripInfo through the foreign key, allowing the app to obtain information to
    perform carbon emission calculations.
    """
    trip = models.ForeignKey(TripInfo, on_delete=models.CASCADE, related_name='carbon_footprints')
    distance_km = models.DecimalField(max_digits=8, decimal_places=2)
    carbon_emissions_kg = models.DecimalField(max_digits=8, decimal_places=2)
    # Need a hardcoded calculation for carbon emissions for simplicity
    #   0g per km for metro
    #   40g per km for rail
    #   170g per km for diesel car

class CrowdSourcedData(models.Model):
    """
    CrowdSourcedData is data collected by users. It can include anything from complaints to comments
    about their trip.

    This model allows the app to store information inputted by users, particularly rating data.
    This ranges from service disruptions, cleanliness of a particular carriage,
    accessibility information, and of course if there is a transport officer on the train. lol
    """
    trip = models.ForeignKey(TripInfo, on_delete=models.CASCADE, related_name='crowdsourced_data')
    comments = models.CharField(max_length=200) # includes train guard annoucements
    transport_officer = models.BooleanField(default=False) #lol
    is_delay = models.BooleanField(default=False)
    cleanliness = models.IntegerField(default=5)
    crowdedness = models.IntegerField(default=5)
    carriage_number = models.CharField(max_length=4, validators=[MinLengthValidator(4)])
    # can add more later.