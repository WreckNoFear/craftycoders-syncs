from django.db import models
from django.core.validators import MinLengthValidator

# Create your models here.


class Train(models.Model):
    trip_id = models.CharField(max_length=200, primary_key=True)
    vehicle = models.CharField(max_length=200) # metro or train
    current_latitude = models.FloatField()
    current_longitude = models.FloatField()


class TripInfo(models.Model):
    """
    TripInfo represents data retrieved by the TransportNSW API.
    """
    # Could use an ENUM for transport type
    # class transport_type(models.TextChoices):
    #     TRAIN = 'Train', 'Train'
    #     METRO = 'Metro', 'Metro'
    #     LIGHTRAIL = 'Light Rail', 'Light Rail'
    duration = models.BigIntegerField()
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    start_station = models.CharField(max_length=200)
    end_station = models.CharField(max_length=200)




class TripLeg(models.Model):
    train = models.ForeignKey(Train, on_delete=models.CASCADE)
    start_latitude = models.FloatField()
    start_longitude = models.FloatField()
    end_latitude = models.FloatField()
    end_longitude = models.FloatField()
    path = models.JSONField(default=list)  

class TripPoint(models.Model):
    id = models.AutoField(primary_key=True)
    num = models.BigIntegerField()
    trip_leg = models.ForeignKey(TripLeg, on_delete=models.CASCADE)
    latitude = models.FloatField()
    longitude = models.FloatField()



class CarbonFootprint(models.Model):
    """
    CarbonFootprint represents environmental data about a particular trip.

    It links back to TripInfo through the foreign key, allowing the app to obtain information to
    perform carbon emission calculations.
    """
    # trip = models.ForeignKey(TripInfo, on_delete=models.CASCADE, related_name='carbon_footprints')
    trip = models.OneToOneField(TripInfo, on_delete=models.CASCADE, primary_key=True)
    distance_km = models.FloatField(default=0.0)
    carbon_emissions_saved_kg = models.FloatField(default=0.0)


class CrowdSourcedData(models.Model):
    """
    CrowdSourcedData is data collected by users. It can include anything from complaints to comments
    about their trip.

    This model allows the app to store information inputted by users, particularly rating data.
    This ranges from service disruptions, cleanliness of a particular carriage,
    accessibility information, and of course if there is a transport officer on the train. lol
    """
    trip = models.ForeignKey(TripInfo, on_delete=models.CASCADE, related_name='crowdsourced_data')
    comments = models.CharField(max_length=200) # includes train guard announcements
    transport_officer = models.BooleanField(default=False) #lol
    is_delay = models.BooleanField(default=False)
    cleanliness = models.IntegerField(default=5)
    crowdedness = models.IntegerField(default=5)
    carriage_number = models.CharField(max_length=4, validators=[MinLengthValidator(4)])
    # can add more later.