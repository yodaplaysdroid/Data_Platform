import mysql.connector
import dmPython
from datetime import datetime


# Mysql 类
# 存放着所有基于 Mysql 数据迁移的函数
class Mysql_Input:
    def __init__(self, username: str, password: str, host: str) -> None:
        self.username = username
        self.password = password
        self.host = host
        print(self.username, self.password, self.host)

    # get 本对象的基本信息
    # 确保所需的信息齐全
    def get_attributes(self) -> dict:
        res = {}
        res["message"] = f"{self.username}, {self.password}, {self.host}"
        res["status"] = 0
        print(res)
        return res

    # 连接测试
    # status: 0 -> 过程成功执行
    # status: -1 -> 连不上
    def test_connection(self) -> dict:
        res = {}
        try:
            connection = mysql.connector.connect(
                user=self.username,
                password=self.password,
                host=self.host,
            )
            connection.close()
            res["status"] = 0
        except Exception as e:
            print(e)
            res["status"] = -1
        return res

    # 取数据库名
    # status: 0 -> 过程成功执行
    # status: -1 -> 连不上
    def get_databases(self) -> dict:
        res = {}
        if self.test_connection()["status"] != 0:
            res["status"] = -1
        else:
            connection = mysql.connector.connect(
                user=self.username,
                password=self.password,
                host=self.host,
            )
            cursor = connection.cursor()
            cursor.execute("show databases")
            results = cursor.fetchall()
            print(results)
            res["status"] = 0
            res["databases"] = [result[0] for result in results]
            cursor.close()
            connection.close()
        return res

    # 对相应的数据库取表名
    # status: 0 -> 过程成功执行
    # status: -1 -> 连不上
    # status: -2 -> 禁止访问此数据库
    def get_tables(self, database: str) -> dict:
        res = {}
        if self.test_connection()["status"] != 0:
            res["status"] = -1
        else:
            try:
                connection = mysql.connector.connect(
                    user=self.username,
                    password=self.password,
                    host=self.host,
                    database=database,
                )
            except Exception as e:
                print(e)
                res["status"] = -2
                return res
            cursor = connection.cursor()
            cursor.execute("show tables")
            results = cursor.fetchall()
            print(results)
            res["status"] = 0
            res["tables"] = [result[0] for result in results]
            cursor.close()
            connection.close()
        return res

    # 验证身份证格式
    def __is_valid_id(id: str) -> bool:
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
        def verify(self, id: str):
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

    def get_columns(self, database: str, read_table: str) -> dict:
        res = {}
        if self.test_connection()["status"] != 0:
            res["status"] = -1
        else:
            # 连接 Mysql 数据库
            connection = mysql.connector.connect(
                user=self.username,
                password=self.password,
                host=self.host,
                database=database,
            )
            cursor = connection.cursor()

            try:
                cursor.execute(f"show columns from {read_table}")
                results = cursor.fetchall()
                res["columns1"] = [result[0] for result in results]
            except Exception as e:
                res["status"] = -2
        return res

    # 从 Mysql 提取表数据并迁移至达梦数据库
    # status: 0 -> 过程成功执行
    # status: -10 -> 连接不上达梦数据库
    # status: -1 -> 此表不存在
    # status: >1 -> 数据导入问题（可能出现违规 sql 约束问题）
    def extract(self, database: str, read_table: str, write_table: str) -> dict:
        res = {}
        if self.test_connection()["status"] != 0:
            res["status"] = -1
        else:
            # 连接达梦数据库
            try:
                dm = dmPython.connect(
                    user="weiyin",
                    password="lamweiyin",
                    server="36.140.31.145",
                    port="31826",
                    autoCommit=True,
                )
                dmc = dm.cursor()
            except Exception as e:
                print(e)
                res["status"] = -10
                return res

            # 连接 Mysql 数据库
            connection = mysql.connector.connect(
                user=self.username,
                password=self.password,
                host=self.host,
                database=database,
            )
            cursor = connection.cursor()

            # 从 Mysql 提取数据
            try:
                count = 0
                cursor.execute(f"select * from {read_table}")
                results = cursor.fetchall()

                # 把数据一条一条刷入达梦数据库
                # 治理客户身份证号码
                if write_table == "客户信息":
                    for result in results:
                        try:
                            if self.__is_valid_id(result[1]):
                                dmc.execute(
                                    f"insert into {write_table} values {result}"
                                )
                            else:
                                string = list(result)
                                string.append("身份证格式不对")
                                string = tuple(string)
                                dmc.execute(
                                    f"insert into {write_table}tmp values {string}"
                                )
                                print("身份证格式不对")
                                count += 1
                        except Exception as e:
                            string = list(result)
                            string.append(str(e))
                            string = tuple(string)
                            dmc.execute(f"insert into {write_table}tmp values {string}")
                            print(e)
                            count += 1
                else:
                    for result in results:
                        try:
                            dmc.execute(f"insert into {write_table} values {result}")
                        except Exception as e:
                            string = list(result)
                            string.append(str(e))
                            string = tuple(string)
                            dmc.execute(f"insert into {write_table}tmp values {string}")
                            print(e)
                            count += 1

                res["status"] = count

            except Exception as e:
                print(e)
                res["status"] = -1

            cursor.close()
            connection.close()
            dmc.close()
            dm.close()
        return res
