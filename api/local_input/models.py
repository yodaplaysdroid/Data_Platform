import pandas as pd
import dmPython
from datetime import datetime


def list_sheets() -> dict:
    res = {"results": []}

    # 加载文件为 pandas dataframe 对象
    try:
        excelfile = pd.ExcelFile("/tmp/local")
        res["status"] = 0
        res["results"] = excelfile.sheet_names
    except Exception as e:
        print("File Reading Error", e)
        res["status"] = -2

    return res


# 验证身份证格式
def is_valid_id(id: str) -> bool:
    # 省份代码集
    province = (
        list(range(11, 16))
        + list(range(21, 24))
        + list(range(31, 38))
        + list(range(41, 47))
        + list(range(50, 55))
        + list(range(61, 66))
        + [71, 81, 82]
    )
    # 城市代码集
    state = list(range(0, 91))
    # 区域代码集
    city = list(range(1, 100))

    # 验证校验码是否正确
    def verify(id):
        sum = 0
        wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
        for i in range(17):
            sum += int(id[i]) * wi[i]
        j = sum % 11
        rem = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"]
        return id[17] == rem[j]

    # 验证身份证的日期正确性
    def is_valid_date(date_string):
        try:
            datetime.strptime(date_string, "%Y%m%d")
            return True
        except ValueError:
            return False

    if int(id[0:2]) not in province:
        return False
    if int(id[2:4]) not in state:
        return False
    if int(id[4:6]) not in city:
        return False
    if not is_valid_date(id[6:14]):
        return False
    try:
        int(id[14:17])
    except:
        return False
    if not verify(id):
        return False
    return True


def get_columns(filetype: str, sheet_name: str) -> dict:
    res = {}

    # 加载文件为 pandas dataframe 对象
    if filetype == "csv":
        try:
            df = pd.read_csv("/tmp/local", encoding="gbk", quotechar="'")
        except Exception as e:
            try:
                df = pd.read_csv("/tmp/local", encoding="utf-8", quotechar="'")
            except Exception as f:
                print(f)
                print("File Reading Error", e)
                res["status"] = -2
                return res
    elif filetype == "txt":
        try:
            df = pd.read_csv("/tmp/local", sep="\t", encoding="gbk", quotechar="'")
        except Exception as e:
            try:
                df = pd.read_csv(
                    "/tmp/local", sep="\t", encoding="utf-8", quotechar="'"
                )
            except Exception as f:
                print(f)
                print("File Reading Error", e)
                res["status"] = -2
                return res
    else:
        try:
            df = pd.read_excel("/tmp/local", sheet_name=sheet_name)
        except Exception as e:
            print("File Reading Error", e)
            res["status"] = -2
            return res

    res["columns1"] = df.columns.to_list()
    return res


# 采取数据
# status: 0 -> 成功
# status: -1 -> 连接失败
# status: -2 -> 文件不存在
# status: -10 -> 达梦连不上
# status: >1 -> 数据导入问题（可能出现违规 sql 约束问题）
def extract(
    write_table: str, filetype: str, use_columns: list, sheet_name="", user=""
) -> dict:
    res = {}

    try:
        dm = dmPython.connect("dt/lamweiyin@dm8-dmserver.cnsof17014913-system.svc:5236")
        dmc = dm.cursor()
    except Exception as e:
        print(e)
        res["status"] = -10
        return res

    # 加载文件为 pandas dataframe 对象
    if filetype == "csv":
        try:
            df = pd.read_csv(
                "/tmp/local", encoding="gbk", quotechar="'", usecols=use_columns
            )
        except Exception as e:
            try:
                df = pd.read_csv(
                    "/tmp/local", encoding="utf-8", quotechar="'", usecols=use_columns
                )
            except Exception as f:
                print(f)
                print("File Reading Error", e)
                res["status"] = -2
                return res
    elif filetype == "txt":
        try:
            df = pd.read_csv(
                "/tmp/local",
                sep="\t",
                encoding="gbk",
                quotechar="'",
                usecols=use_columns,
            )
        except Exception as e:
            try:
                df = pd.read_csv(
                    "/tmp/local",
                    sep="\t",
                    encoding="utf-8",
                    quotechar="'",
                    usecols=use_columns,
                )
            except Exception as f:
                print(f)
                print("File Reading Error", e)
                res["status"] = -2
                return res
    else:
        try:
            df = pd.read_excel("/tmp/local", sheet_name=sheet_name, usecols=use_columns)
        except Exception as e:
            print("File Reading Error", e)
            res["status"] = -2
            return res

    # 数据迁移
    count = 0
    if write_table == "客户信息":
        for i, r in df.iterrows():
            r = list(r)
            r.append(user)
            try:
                if is_valid_id(r[1]):
                    dmc.execute(f"insert into {write_table} values {tuple(r)}")
                else:
                    string = list(r)
                    string.append("身份证格式不对")
                    string = tuple(string)
                    dmc.execute(f"insert into {write_table}tmp values {string}")
                    print("身份证格式不对")
                    count += 1
            except Exception as e:
                string = list(r)
                string.append(str(e))
                string = tuple(string)
                dmc.execute(f"insert into {write_table}tmp values {string}")
                print(e)
                count += 1
    else:
        for i, r in df.iterrows():
            r = list(r)
            r.append(user)
            try:
                dmc.execute(f"insert into {write_table} values {tuple(r)}")
            except Exception as e:
                string = list(r)
                string.append(str(e))
                string = tuple(string)
                dmc.execute(f"insert into {write_table}tmp values {string}")
                print(e)
                count += 1

    dmc.close()
    dm.close()
    res["status"] = count
    return res
