import mysql.connector
import dmPython


# Mysql 类
# 存放着所有基于 Mysql 数据迁移的函数
class Mysql_Input:
    def __init__(self, req) -> None:
        self.username = req["username"]
        self.password = req["password"]
        self.host = req["host"]
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
    def get_tables(self, database) -> dict:
        res = {}
        if self.test_connection()["status"] != 0:
            res["status"] = -1
        else:
            connection = mysql.connector.connect(
                user=self.username,
                password=self.password,
                host=self.host,
                database=database,
            )
            cursor = connection.cursor()
            cursor.execute("show tables")
            results = cursor.fetchall()
            print(results)
            res["status"] = 0
            res["tables"] = [result[0] for result in results]
            cursor.close()
            connection.close()
        return res

    # 从 Mysql 提取表数据并迁移至达梦数据库
    # status: 0 -> 过程成功执行
    # status: -10 -> 连接不上达梦数据库
    # status: -1 -> 此表不存在
    # status: >1 -> 数据导入问题（可能出现违规 sql 约束问题）
    def extract(self, database, read_table, write_table) -> dict:
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
                for result in results:
                    try:
                        dmc.execute(f"insert into {write_table} values {result}")
                    except Exception as e:
                        dmc.execute(f"insert into {write_table}tmp values {result}")
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
