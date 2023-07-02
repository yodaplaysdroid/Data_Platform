from django.urls import path
from . import views

urlpatterns = [
    path("", views.query),
    path("refresh/", views.refresh),
]
