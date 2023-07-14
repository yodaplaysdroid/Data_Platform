from django.http import JsonResponse
from .models import *
from django.views.decorators.csrf import csrf_exempt
import json


# admin 用户访问数据库的接口
# get request 会执行 DQL 函数
# post request 会执行 DML 函数
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


# 用于更新数据条个数的接口
@csrf_exempt
def refresh(request):
    res = record_refresh()
    return JsonResponse(res)
