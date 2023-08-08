from django.urls import path
from . import views

urlpatterns = [
    path("send_file/", views.send_file),
    path("get_sheets/", views.get_sheets),
    path("get_columns/", views.get_columns),
    path("data_transfer/", views.data_transfer),
]
