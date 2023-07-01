import dmPython


# Dameng 类
class Dameng:
    def __init__(
        self,
        username="weiyin",
        password="lamweiyin",
        server="36.140.31.145",
        port="31826",
    ) -> None:
        self.username = username
        self.password = password
        self.server = server
        self.port = port
        return

    # 连接达梦数据库
    # status: 0 -> 连接成功
    # status: -1 -> 连接失败
    def connect(self) -> int:
        try:
            self.connection = dmPython.connect(
                user=self.username,
                password=self.password,
                server=self.server,
                port=self.port,
                autoCommit=True,
            )
            self.cursor = self.connection.cursor()
            return 0
        except Exception as e:
            print(e)
            return -1

    # 采取对应表的有错误数据
    # 每次采取只有 50 条
    # status: 0 -> 采取成功
    # status: -1 -> 连接失败
    # status: -2 -> 表不存在
    def get_tmp(self, table: str, start_point: int, records: int) -> dict:
        res = {}
        if self.connect() == 0:
            try:
                self.cursor.execute(
                    f"select * from {table}tmp where id >= {start_point} limit {records}"
                )
                results = self.cursor.fetchall()
                res["errors"] = []
                for result in results:
                    res["errors"].append(list(result))
                res["status"] = 0
            except Exception as e:
                print(e)
                res["status"] = -2
            self.connection.close()
        else:
            res["status"] = -1
        return res

    # 修复错误信息
    # 把前端提供的新数据导入表中
    # status: >0 -> 仍是错误信息的个数
    # status: -1 -> 连接失败
    def fix_errors(self, table_name: str, items_to_fix: list):
        res = {}
        if self.connect() == 0:
            count = 0
            for id, attributes in items_to_fix:
                try:
                    self.cursor.execute(
                        f"insert into {table_name} values {tuple(attributes)}"
                    )
                    self.cursor.execute(
                        f"delete from {table_name} where id == {int(id)}"
                    )
                except Exception as e:
                    print(e)
                    try:
                        res["errors"].append([id, str(e)])
                    except:
                        res["errors"] = [
                            [id, str(e)],
                        ]
                    count += 1
            res["status"] = count
        else:
            res["status"] = -1
        return res

    def delete_errors(self, table_name: str, items_to_delete: list):
        res = {}
        if self.connect() == 0:
            count = 0
            for id in items_to_delete:
                try:
                    self.cursor.execute(
                        f"delete from {table_name}tmp where id == {int(id)}"
                    )
                except Exception as e:
                    print(e)
                    count += 1
            res["status"] = count
        else:
            res["status"] = -1
        return res
