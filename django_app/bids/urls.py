from django.urls import path
from . import views

urlpatterns = [
    path('simulate-bid/', views.simulate_bid, name='simulate_bid'),
]
