from django.http import JsonResponse
from .models import Mysql_Input
from django.views.decorators.csrf import csrf_exempt
import json


# status: 0 -> 过程成功执行
# status: 99 -> 请求方式不对
@csrf_exempt
def data_transfer(request):
    if request.method == "POST":
        data = json.loads(request.body)
        req = {}
        for i in data:
            req[i] = data.get(i)
        print("Request: ", req)

        mysql = Mysql_Input(req)
        res = mysql.extract("test", "装货表", "装货表")
        print("Response: ", res)
        return JsonResponse(res)
    else:
        return JsonResponse(
            {"status": 99, "message": "suppose to use POST requests instead of GET"}
        )
