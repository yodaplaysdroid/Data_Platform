from django.http import JsonResponse
from .models import Dameng
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
        res["columns"] = columns[table_name]

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
def fix_error(request):
    if request.method == "POST":
        data = json.loads(request.body)
        table_name = data.get("tablename")
        item_to_fix = data.get("itemtofix")

        dm = Dameng()
        res = dm.fix_error(table_name, item_to_fix)

        return JsonResponse(res)

    else:
        return JsonResponse(
            {"status": 99, "message": "suppose to use POST requests instead of GET"}
        )
