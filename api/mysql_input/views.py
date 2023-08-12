from django.http import JsonResponse
from .models import Mysql_Input
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


# status: 0 -> 过程成功执行
# status: 99 -> 请求方式不对
# response = {status: int}
@csrf_exempt
def test_connection(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data.get("username")
        password = data.get("password")
        host = data.get("host")

        mysql = Mysql_Input(username, password, host)
        res = mysql.test_connection()
        print(res)
        return JsonResponse(res)
    else:
        return JsonResponse(
            {"status": 99, "message": "suppose to use POST requests instead of GET"}
        )


# status: 0 -> 过程成功执行
# status: 99 -> 请求方式不对
# response = {status: int, databases: list<str>}
@csrf_exempt
def get_databases(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data.get("username")
        password = data.get("password")
        host = data.get("host")

        mysql = Mysql_Input(username, password, host)
        res = mysql.get_databases()
        print(res)
        return JsonResponse(res)
    else:
        return JsonResponse(
            {"status": 99, "message": "suppose to use POST requests instead of GET"}
        )


# status: 0 -> 过程成功执行
# status: 99 -> 请求方式不对
# response = {status: int, tables: list<str>}
@csrf_exempt
def get_tables(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data.get("username")
        password = data.get("password")
        host = data.get("host")
        database = data.get("database")

        mysql = Mysql_Input(username, password, host)
        res = mysql.get_tables(database)
        print(res)
        return JsonResponse(res)
    else:
        return JsonResponse(
            {"status": 99, "message": "suppose to use POST requests instead of GET"}
        )


# status: 0 -> 过程成功执行
# status: 99 -> 请求方式不对
# response = {status: int}
@csrf_exempt
def get_columns(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data.get("username")
        password = data.get("password")
        host = data.get("host")
        database = data.get("database")
        read_table = data.get("readtable")
        write_table = data.get("writetable")

        mysql = Mysql_Input(username, password, host)
        res = mysql.get_columns(database, read_table)
        res["columns2"] = columns[write_table]
        print(res)
        return JsonResponse(res)
    else:
        return JsonResponse(
            {"status": 99, "message": "suppose to use POST requests instead of GET"}
        )


# status: 0 -> 过程成功执行
# status: 99 -> 请求方式不对
# response = {status: int}
@csrf_exempt
def data_transfer(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data.get("username")
        password = data.get("password")
        host = data.get("host")
        database = data.get("database")
        read_table = data.get("readtable")
        write_table = data.get("writetable")
        select_columns = data.get("selectcolumns")
        user = data.get("user")

        mysql = Mysql_Input(username, password, host)
        res = mysql.extract(database, read_table, write_table, select_columns, user)
        print(res)
        return JsonResponse(res)
    else:
        return JsonResponse(
            {"status": 99, "message": "suppose to use POST requests instead of GET"}
        )
