import dmPython


# admin 用户的数据库查询函数
# 此函数用于 select 类型的查询语句，不适合执行语句
def db_query(
    query: str, cred="weiyin/lamweiyin@dm8-dmserver.cnsof17014913-system.svc:5236"
) -> dict:
    res = {}
    try:
        connection = dmPython.connect(cred)
        cursor = connection.cursor()
        cursor.execute(query)
        res["results"] = [list(result) for result in cursor.fetchall()]
        res["status"] = 0
    except Exception as e:
        print(e)
        res["status"] = -1
    return res


# admin 用户的数据库执行函数
# 用于更改 / 执行某些命令的函数，不反馈查询结果
def db_exec(
    query: str, cred="weiyin/lamweiyin@dm8-dmserver.cnsof17014913-system.svc:5236"
) -> dict:
    res = {}
    try:
        connection = dmPython.connect(cred)
        cursor = connection.cursor()
        cursor.execute(query)
        res["status"] = 0
    except Exception as e:
        print(e)
        res["status"] = -1
        res["error"] = str(e)
    return res


# 更新记录个数的函数
def record_refresh() -> dict:
    res = {}
    res["status"] = 0
    tables = ["物流公司", "客户信息", "物流信息", "集装箱动态", "装货表", "卸货表"]
    for table in tables:
        res["status"] += db_exec(
            f"update 记录信息 set 记录个数 = (select count(*) from {table}) where 表名 = '{table}'"
        )["status"]
    return res
