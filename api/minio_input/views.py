from django.http import JsonResponse
from .models import Minio_Input
from django.views.decorators.csrf import csrf_exempt
import json


# status: 0 -> 迁移成功
# status: 99 -> request method 不对
# response = {status: int}
@csrf_exempt
def test_connection(request):
    if request.method == "POST":
        data = json.loads(request.body)
        endpoint = data.get("endpoint")
        access_key = data.get("accesskey")
        secret_key = data.get("secretkey")

        minn = Minio_Input(endpoint, access_key, secret_key)
        res = minn.test_connection()
        print(res)
        return JsonResponse(res)
    else:
        return JsonResponse(
            {"status": 99, "message": "suppose to use POST requests instead of GET"}
        )


# status: 0 -> 迁移成功
# status: 99 -> request method 不对
# response = {status: int, buckets: list<str>}
@csrf_exempt
def get_buckets(request):
    if request.method == "POST":
        data = json.loads(request.body)
        endpoint = data.get("endpoint")
        access_key = data.get("accesskey")
        secret_key = data.get("secretkey")

        minn = Minio_Input(endpoint, access_key, secret_key)
        res = minn.list_buckets()
        print(res)
        return JsonResponse(res)
    else:
        return JsonResponse(
            {"status": 99, "message": "suppose to use POST requests instead of GET"}
        )


# status: 0 -> 迁移成功
# status: 99 -> request method 不对
# response = {status: int, objects: list<str>}
@csrf_exempt
def get_files(request):
    if request.method == "POST":
        data = json.loads(request.body)
        endpoint = data.get("endpoint")
        access_key = data.get("accesskey")
        secret_key = data.get("secretkey")
        bucket = data.get("bucket")

        minn = Minio_Input(endpoint, access_key, secret_key)
        res = minn.list_files(bucket)
        print(res)
        return JsonResponse(res)
    else:
        return JsonResponse(
            {"status": 99, "message": "suppose to use POST requests instead of GET"}
        )


# status: 0 -> 迁移成功
# status: 99 -> request method 不对
# response = {status: int}
@csrf_exempt
def data_transfer(request):
    if request.method == "POST":
        data = json.loads(request.body)
        endpoint = data.get("endpoint")
        access_key = data.get("accesskey")
        secret_key = data.get("secretkey")
        bucket = data.get("bucket")
        directory = data.get("directory")
        filetype = data.get("filetype")
        write_table = data.get("writetable")
        sheet_name = data.get("sheetname")

        minn = Minio_Input(endpoint, access_key, secret_key)
        res = minn.extract(bucket, directory, write_table, filetype, sheet_name)
        print(res)
        return JsonResponse(res)
    else:
        return JsonResponse(
            {"status": 99, "message": "suppose to use POST requests instead of GET"}
        )
