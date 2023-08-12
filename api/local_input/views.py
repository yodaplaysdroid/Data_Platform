from django.conf import settings
from django.core.files.storage import FileSystemStorage
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from . import models
import os

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


@csrf_exempt
def send_file(request):
    if request.method == "POST" and request.FILES.get("file"):
        uploaded_file = request.FILES["file"]

        # Save the file to a specific directory
        os.system("rm /tmp/local")
        fs = FileSystemStorage(location=settings.MEDIA_ROOT)
        filename = fs.save("local", uploaded_file)
        uploaded_file_url = fs.url(filename)

        return JsonResponse(
            {
                "status": 0,
                "message": "File uploaded successfully.",
                "file_url": uploaded_file_url,
            }
        )
    else:
        return JsonResponse({"error": "Invalid request."}, status=400)


# status: 0 -> 迁移成功
# status: 99 -> request method 不对
# response = {status: int}
@csrf_exempt
def get_sheets(request):
    res = models.list_sheets()
    print(res)
    return JsonResponse(res)


# status: 0 -> 迁移成功
# status: 99 -> request method 不对
# response = {status: int}
@csrf_exempt
def get_columns(request):
    if request.method == "POST":
        data = json.loads(request.body)
        filetype = data.get("filetype")
        write_table = data.get("writetable")
        sheet_name = data.get("sheetname")

        res = models.get_columns(filetype, sheet_name)
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
        filetype = data.get("filetype")
        write_table = data.get("writetable")
        sheet_name = data.get("sheetname")
        use_columns = data.get("usecolumns")
        user = data.get("user")

        res = models.extract(write_table, filetype, use_columns, sheet_name, user)
        print(res)
        return JsonResponse(res)
    else:
        return JsonResponse(
            {"status": 99, "message": "suppose to use POST requests instead of GET"}
        )
