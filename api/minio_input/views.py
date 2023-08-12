from django.http import JsonResponse
from .models import Minio_Input
from django.views.decorators.csrf import csrf_exempt
import json

columns = {
    "物流公司": [
        "公司名称",
        "客户编号",
        "联系人",
        "电话",
        "省市区",
    ],
    "客户信息": ["客户名称", "客户编号", "手机号", "省市区"],
    "物流信息": ["提单号", "货主名称", "货主代码", "物流公司_货代", "集装箱箱号", "货物名称", "货重_吨"],
    "集装箱动态": ["堆存港口", "集装箱箱号", "箱尺寸_TEU", "提单号", "堆场位置", "操作", "操作日期"],
    "装货表": [
        "船公司",
        "船名称",
        "作业开始时间",
        "作业结束时间",
        "始发时间",
        "到达时间",
        "作业港口",
        "提单号",
        "集装箱箱号",
        "箱尺寸_TEU",
        "启运地",
        "目的地",
    ],
    "卸货表": [
        "船公司",
        "船名称",
        "作业开始时间",
        "作业结束时间",
        "始发时间",
        "到达时间",
        "作业港口",
        "提单号",
        "集装箱箱号",
        "箱尺寸_TEU",
        "启运地",
        "目的地",
    ],
}


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
# response = {status: int, objects: list<str>}
@csrf_exempt
def get_sheets(request):
    if request.method == "POST":
        data = json.loads(request.body)
        endpoint = data.get("endpoint")
        access_key = data.get("accesskey")
        secret_key = data.get("secretkey")
        bucket = data.get("bucket")
        directory = data.get("directory")

        minn = Minio_Input(endpoint, access_key, secret_key)
        res = minn.list_sheets(bucket, directory)
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
def get_columns(request):
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
        res = minn.get_columns(bucket, directory, filetype, sheet_name)
        res["columns2"] = columns[write_table]
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
        use_columns = data.get("usecolumns")
        user = data.get("user")

        minn = Minio_Input(endpoint, access_key, secret_key)
        res = minn.extract(
            bucket, directory, write_table, filetype, use_columns, sheet_name, user
        )
        print(res)
        return JsonResponse(res)
    else:
        return JsonResponse(
            {"status": 99, "message": "suppose to use POST requests instead of GET"}
        )
