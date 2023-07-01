from django.http import JsonResponse
from .models import HDFS
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
    "物流信息": ["提单号", "货主名称", "货主代码", "物流公司", "集装箱箱号", "货物名称", "货重_吨"],
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
def get_columns(request):
    if request.method == "POST":
        data = json.loads(request.body)
        directory = data.get("directory")
        filename = data.get("filename")
        filetype = data.get("filetype")
        write_table = data.get("writetable")
        sheet_name = data.get("sheetname")

        hadoop = HDFS(directory)
        res = hadoop.get_columns(filetype, filename, sheet_name)
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
