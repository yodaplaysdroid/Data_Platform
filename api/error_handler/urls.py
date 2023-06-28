from django.urls import path
from . import views

urlpatterns = [
    path("get_tmp/", views.get_tmp),
]
