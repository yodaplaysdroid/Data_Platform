## 后端 api

### 1. 数据导入

#### 1.1 Mysql 数据导入 -> mysql_input/

---

##### 1.1.1 测试 Mysql 连接 -> test_connection/

- Request 格式：Json{username: str, password: str, host: str}
- Response 格式：Json{status: int}

##### 1.1.2 采取连接对应 Mysql 的数据库 -> get_databases/

- Request 格式：Json{username: str, password: str, host: str}
- Response 格式：Json{status: int, databases: list\<str>}

##### 1.1.3 采取所选数据库里的所有表 -> get_tables/

- Request 格式：Json{username: str, password: str, host: str， database: str}
- Response 格式：Json{status: int, tables: list\<str>}

##### 1.1.4 数据迁移 -> data_transfer/

- Request 格式：Json{username: str, password: str, host: str， database: str, readtable: str, writetable: str}
- Response 格式：Json{status: int}

#### 1.2 HDFS 数据导入 -> hdfs_input/

---

##### 1.2.1 测试 HDFS 连接 -> test_connection/

- Request 格式：Json{directory: str}
- Response 格式：Json{status: int, files: list\<str>}

##### 1.2.2 数据迁移 -> data_transfer/

- Request 格式：Json{directory: str, filename: str, filetype: str, writetable: str, sheetname: str}
- Response 格式：Json{status: int}

注：directory 格式为："remote:/dir/"（后面必须加斜杠），filename 格式为："filename"（前后均不用斜杠）

#### 1.3 MinIO 数据导入 -> minio_input/

---

##### 1.3.1 测试 MinIO 连接 -> test_connection/

- Request 格式：Json{endpoint: str, secretkey: str, accesskey: str}
- Response 格式：Json{status: int}

##### 1.3.2 采取 MinIO 的 buckets -> get_buckets/

- Request 格式：Json{endpoint: str, secretkey: str, accesskey: str}
- Response 格式：Json{status: int， buckets: list\<str>}

##### 1.3.3 采取 MinIO 所选 buckets 中的 files -> get_files/

- Request 格式：Json{endpoint: str, secretkey: str, accesskey: str, bucket: str}
- Response 格式：Json{status: int， objects: list\<str>}

##### 1.3.4 数据迁移 -> data_transfer/

- Request 格式：Json{endpoint: str, secretkey: str, accesskey: str, bucket: str, directory: str, filetype: str, writetable: str, sheetname: str}
- Response 格式：Json{status: int}

注：directory 包含 filename，格式为："directory/file"（前后均无斜杠）且不包含 bucket 名字

### 2. 错误处理 -> error_handler/

---

#### 2.1 采取对应表格所有不符合并还没处理过的数据 -> get_tmp/

- Request 格式: Json{tablename: str}
- Response 格式: Json{status: int, errors: list\<json>}

注：errors 的格式为 [{错误种类: [[出错记录的 id, [出错记录里的整条记录的值]],]}]

例：errors: [{unique constraint: [[1, ['张三', '1234567890', '15188887777', '江苏省南京市江宁区']], [2, ['李四', '0987654321', '13766662222', '江苏省南京市鼓楼区']], ]}, {reference constraint: [[3, ['徐坤', '71717171727628', '176356551265', '浙江省杭州市']], ]}, ]

#### 2.2 修复对应表格的数据（建议先采取错误集再对错误集修改） -> fix_errors/

- Request 格式: Json{tablename: str, itemstofix: \<list\<list>>}

注：itemstofix 格式为：[[id, [记录属性]], ]\
[[1, ['张三', '1234567890', '15188887777', '江苏省南京市江宁区']], [2, ['李四', '0987654321', '13766662222', '江苏省南京市鼓楼区']], [3, ['徐坤', '71717171727628', '176356551265', '浙江省杭州市']]]

- Response 格式: Json{status: int, errors: list\<list>}

注：errors 格式为：[[id, 错误类型], ]

### 3. 数据采取/数据分析（针对达梦数据库） ->

还未有数据，请稍后。。
