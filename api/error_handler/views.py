from django.http import JsonResponse
from .models import Dameng
from django.views.decorators.csrf import csrf_exempt
import json


# status: 0 -> 迁移成功
# status: 99 -> request method 不对
# response = {status: int, errors: list<json>}
@csrf_exempt
def get_tmp(request):
    if request.method == "POST":
        data = json.loads(request.body)
        table_name = data.get("tablename")
        start_point = data.get("startpoint")
        records = data.get("records")

        dm = Dameng()
        res = dm.get_tmp(table_name, start_point, records)

        return JsonResponse(res)

    else:
        return JsonResponse(
            {"status": 99, "message": "suppose to use POST requests instead of GET"}
        )


# status: 0 -> 迁移成功
# status: 99 -> request method 不对
# response = {status: int, errors: list<json>}
@csrf_exempt
def delete_errors(request):
    if request.method == "POST":
        data = json.loads(request.body)
        table_name = data.get("tablename")
        items_to_delete = data.get("itemstodelete")

        dm = Dameng()
        res = dm.delete_errors(table_name, items_to_delete)

        return JsonResponse(res)

    else:
        return JsonResponse(
            {"status": 99, "message": "suppose to use POST requests instead of GET"}
        )


# status: 0 -> 迁移成功
# status: 99 -> request method 不对
# response = {status: int, errors: list<json>}
@csrf_exempt
def fix_errors(request):
    if request.method == "POST":
        data = json.loads(request.body)
        table_name = data.get("tablename")
        items_to_fix = data.get("itemstofix")

        dm = Dameng()
        res = dm.fix_errors(table_name, items_to_fix)

        return JsonResponse(res)

    else:
        return JsonResponse(
            {"status": 99, "message": "suppose to use POST requests instead of GET"}
        )
