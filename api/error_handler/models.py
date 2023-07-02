import dmPython
from datetime import datetime


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

    # 验证身份证格式
    def __is_valid_id(self, id: str) -> bool:
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

    # 修复错误信息
    # 把前端提供的新数据导入表中
    # status: >0 -> 仍是错误信息的个数
    # status: -1 -> 连接失败
    def fix_error(self, table_name: str, item_to_fix: list):
        res = {}
        if self.connect() == 0:
            if table_name == "客户信息" and not self.__is_valid_id(item_to_fix[1][1]):
                res["status"] = -2
                res["errors"] = "身份证格式不对"
                return res
            try:
                self.cursor.execute(
                    f"insert into {table_name} values {tuple(item_to_fix[1])}"
                )
                self.cursor.execute(
                    f"delete from {table_name}tmp where id == {int(item_to_fix[0])}"
                )
                res["status"] = 0
            except Exception as e:
                print(e)
                res["status"] = -2
                res["errors"] = str(e)
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
