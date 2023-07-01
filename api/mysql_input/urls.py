from django.urls import path
from . import views

urlpatterns = [
    path("data_transfer/", views.data_transfer),
    path("test_connection/", views.test_connection),
    path("get_databases/", views.get_databases),
    path("get_tables/", views.get_tables),
    path("get_columns/", views.get_columns),
]
