from django.http import JsonResponse
from .models import HDFS
from django.views.decorators.csrf import csrf_exempt
import json


# status: 0 -> 连接成功
# status: 99 -> request method 不对
# response = {status: int, files: list<str>}
@csrf_exempt
def test_connection(request):
    if request.method == "POST":
        data = json.loads(request.body)
        directory = data.get("directory")

        hadoop = HDFS(directory)
        res = hadoop.test_connection()
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
        directory = data.get("directory")
        filename = data.get("filename")
        filetype = data.get("filetype")
        write_table = data.get("writetable")
        sheet_name = data.get("sheetname")

        hadoop = HDFS(directory)
        res = hadoop.extract(filetype, filename, write_table, sheet_name)
        print(res)
        return JsonResponse(res)
    else:
        return JsonResponse(
            {"status": 99, "message": "suppose to use POST requests instead of GET"}
        )
