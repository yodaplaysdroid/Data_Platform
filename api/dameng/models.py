import dmPython


def db_query(
    query: str,
    username="weiyin",
    password="lamweiyin",
    server="36.140.31.145",
    port="31826",
) -> dict:
    res = {}
    try:
        connection = dmPython.connect(
            user=username,
            password=password,
            server=server,
            port=port,
            autoCommit=True,
        )
        cursor = connection.cursor()
        cursor.execute(query)
        res["results"] = [list(result) for result in cursor.fetchall()]
        res["status"] = 0
    except Exception as e:
        print(e)
        res["status"] = -1
    return res


def db_exec(
    query: str,
    username="weiyin",
    password="lamweiyin",
    server="36.140.31.145",
    port="31826",
) -> dict:
    res = {}
    try:
        connection = dmPython.connect(
            user=username,
            password=password,
            server=server,
            port=port,
            autoCommit=True,
        )
        cursor = connection.cursor()
        cursor.execute(query)
        res["status"] = 0
    except Exception as e:
        print(e)
        res["status"] = -1
        res["error"] = str(e)
    return res


def record_refresh() -> dict:
    res = {}
    res["status"] = 0
    tables = ["物流公司", "客户信息", "物流信息", "集装箱动态", "装货表", "卸货表"]
    for table in tables:
        res["status"] += db_exec(
            f"update 记录信息 set 记录个数 = (select count(*) from {table}) where 表名 = '{table}'"
        )["status"]
    return res
