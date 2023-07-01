from django.urls import path
from . import views

urlpatterns = [
    path("get_tmp/", views.get_tmp),
    path("fix_errors/", views.fix_errors),
    path("delete_errors/", views.delete_errors),
]
