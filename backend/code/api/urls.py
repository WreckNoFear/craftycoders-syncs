from django.urls import path

from . import views
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path("", views.index, name="index"),
    path("register/", views.register_user, name="register"),
    path('request-trips/', views.request_trips, name="request-trips"),
    path('token-auth/', obtain_auth_token),
    path('request-locations/', views.request_locations, name="request-locations"),
    path('choose-route/', views.choose_route, name="choose-route"),
    path('current-train/', views.current_train, name="current-train"),
]