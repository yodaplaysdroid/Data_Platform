from django.urls import path
from . import views

urlpatterns = [
    path("test_connection/", views.test_connection),
    path("get_buckets/", views.get_buckets),
    path("get_files/", views.get_files),
    path("get_sheets/", views.get_sheets),
    path("data_transfer/", views.data_transfer),
    path("get_columns/", views.get_columns),
]
