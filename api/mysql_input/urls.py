from django.urls import path
from . import views

urlpatterns = [
    path("data_transfer/", views.data_transfer),
]
