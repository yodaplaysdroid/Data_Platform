from django.urls import path
from . import views

urlpatterns = [
    path("", views.query),
    path("download/", views.download),
]
