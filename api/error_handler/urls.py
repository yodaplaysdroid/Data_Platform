from django.urls import path
from . import views

urlpatterns = [
    path("get_tmp/", views.get_tmp),
    path("fix_error/", views.fix_error),
    path("delete_errors/", views.delete_errors),
]
