from django.http import JsonResponse
from .models import Mysql_Input
from django.views.decorators.csrf import csrf_exempt
import json


# status: 0 -> 过程成功执行
# status: 99 -> 请求方式不对
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
@csrf_exempt
def get_database(request):
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

        mysql = Mysql_Input(username, password, host)
        res = mysql.extract(database, read_table, write_table)
        print(res)
        return JsonResponse(res)
    else:
        return JsonResponse(
            {"status": 99, "message": "suppose to use POST requests instead of GET"}
        )
