from django.http import JsonResponse
from .models import *
from django.views.decorators.csrf import csrf_exempt
import json


@csrf_exempt
def query(request):
    if request.method == "GET":
        query = request.GET.get("query")
        res = db_query(query)
        return JsonResponse(res)
    if request.method == "POST":
        data = json.loads(request.body)
        query = data.get("query")
        res = db_exec(query)
        return JsonResponse(res)


@csrf_exempt
def refresh(request):
    res = record_refresh()
    return JsonResponse(res)
