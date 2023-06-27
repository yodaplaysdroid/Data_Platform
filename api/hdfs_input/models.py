import dmPython
import os
import datetime
import pandas as pd


class HDFS:
    def __init__(self, directory: str, filename: str) -> None:
        self.directory = directory
        self.filename = filename

    # 测试链接
    # status: 0 -> 成功连接
    # status: -1 -> 连接失败（可能文件不存在/链接事故）
    def test_connection(self) -> dict:
        res = {}
        try:
            if os.system(f"rclone copy {self.directory}{self.filename} /tmp") == 0:
                res["status"] = 0
            else:
                res["status"] = -1

        except Exception as e:
            print("Connection Error / File Not Found:", e)
            res["status"] = -1
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
        def verify(id: str):
            sum = 0
            wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
            for i in range(17):
                sum += int(id[i]) * wi[i]
            j = sum % 11
            rem = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"]
            return id[17] == rem[j]

        # 验证身份证的日期正确性
        def is_valid_date(date_string: str):
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

    # 数据导入从 HDFS 存储到达梦数据库
    # status: -1 -> 链接事故
    # status: -2 -> 文件格式出错/无法读取文件/ excel 页名不对
    # status: -10 -> 达梦链接不上
    def extract(self, filetype: str, write_table: str, sheet_name: str) -> dict:
        res = {}
        try:
            os.system(f"rclone copy {self.directory}{self.filename} /tmp")
            os.system(f"mv /tmp/{self.filename} /tmp/hdfs")
        except Exception as e:
            print("Connection Error / File Not Found:", e)
            res["status"] = -1
            return res

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

        count = 0

        # 加载文件为 pandas dataframe 对象
        if filetype == "csv":
            try:
                df = pd.read_csv("/tmp/hdfs", encoding="gbk", quotechar="'")
            except Exception as e:
                try:
                    df = pd.read_csv("/tmp/hdfs", quotechar="'")
                except Exception as f:
                    print(f)
                print("File Reading Error", e)
                res["status"] = -2
                return res
        elif filetype == "txt":
            try:
                df = pd.read_csv("/tmp/hdfs", sep="\t", encoding="gbk", quotechar="'")
            except Exception as e:
                try:
                    df = pd.read_csv("/tmp/hdfs", sep="\t", quotechar="'")
                except Exception as f:
                    print(f)
                print("File Reading Error", e)
                res["status"] = -2
                return res
        else:
            try:
                df = pd.read_excel("/tmp/hdfs", sheet_name=sheet_name)
            except Exception as e:
                print("File Reading Error", e)
                res["status"] = -2
                return res

        # 数据迁移
        count = 0
        if write_table == "客户信息":
            for i, r in df.iterrows():
                try:
                    if self.__is_valid_id(r[1]):
                        dmc.execute(f"insert into {write_table} values {tuple(r)}")
                    else:
                        dmc.execute(f"insert into {write_table}tmp values {tuple(r)}")
                        print("身份证格式不对")
                        count += 1
                except Exception as e:
                    dmc.execute(f"insert into {write_table}tmp values {tuple(r)}")
                    print(e)
                    count += 1
        else:
            for i, r in df.iterrows():
                try:
                    dmc.execute(f"insert into {write_table} values {tuple(r)}")
                except Exception as e:
                    dmc.execute(f"insert into {write_table}tmp values {tuple(r)}")
                    print(e)
                    count += 1

        dmc.close()
        dm.close()
        return count