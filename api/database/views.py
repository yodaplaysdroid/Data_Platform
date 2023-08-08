from django.http import JsonResponse, FileResponse
from django.views.decorators.csrf import csrf_exempt
import dmPython
import pandas as pd

tables = ["物流公司", "客户信息", "物流信息", "集装箱动态", "装货表", "卸货表"]
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


# 普通用户查询数据库的接口
# 不能用于执行语句，仅支持 DQL 语句
@csrf_exempt
def execute(query: str) -> dict:
    res = {"status": None, "results": []}
    try:
        connection = dmPython.connect(
            "dmuser/Dameng123@dm8-dmserver.cnsof17014913-system.svc:5236"
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


# 调用以上 execute 的函数
@csrf_exempt
def query(request):
    if request.method == "GET":
        query = request.GET.get("query")
        res = execute(query)
    return JsonResponse(res)


# 导出并下载数据库（excel 格式）
@csrf_exempt
def download(request):
    if request.method == "GET":
        if request.GET.get("mode") == "generate":
            connection = dmPython.connect(
                "dmuser/Dameng123@dm8-dmserver.cnsof17014913-system.svc:5236"
            )
            cursor = connection.cursor()
            df = {}
            for table in tables:
                cursor.execute((f"select * from DT.{table}"))
                results = cursor.fetchall()
                df[table] = pd.DataFrame(results, columns=columns[table])

            with pd.ExcelWriter("/tmp/download.xlsx") as writer:
                for table in tables:
                    df[table].to_excel(writer, sheet_name=table, index=False)

            return JsonResponse({"status": 0})

        else:
            try:
                return FileResponse(open("/tmp/download.xlsx", "rb"))
            except Exception as e:
                print(e)
                return JsonResponse({"status": -1})
