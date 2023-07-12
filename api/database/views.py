from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import dmPython


@csrf_exempt
def execute(query: str) -> dict:
    res = {"status": None, "results": []}
    try:
        connection = dmPython.connect(
            user="dbuser",
            password="dbuser123",
            server="36.140.31.145",
            port="31826",
            autoCommit=False,
        )
        cursor = connection.cursor()
        try:
            cursor.execute(query)
            res["results"] = cursor.fetchall()
            res["status"] = 0
        except Exception as e:
            res["status"] = 1
            res["results"] = [str(e)]
    except:
        res["status"] = -1
        res["results"] = ["Connection Error"]
    return res


@csrf_exempt
def query(request):
    if request.method == "GET":
        query = request.GET.get("query")
        res = execute(query)
    return JsonResponse(res)
