import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function Documentation() {
  const [value, setValue] = React.useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="主页功能" {...a11yProps(0)} />
          <Tab label="MySQL 数据导入" {...a11yProps(1)} />
          <Tab label="MinIO 数据导入" {...a11yProps(2)} />
          <Tab label="HDFS 数据导入" {...a11yProps(3)} />
          <Tab label="本地文件数据导入" {...a11yProps(4)} />
          <Tab label="错误记录修复" {...a11yProps(5)} />
          <Tab label="数据库共享 API" {...a11yProps(6)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        1. 在 “货物吞吐同比环比分析”
        的右侧可以选择时间段进行比较，如二月的环比，可以设置时间段 1 为 2020 年
        2 月，时间段 2 为 2021 年 2 月进行比较。
        <br />
        2. 在 “货物流向分析” 的右上方可以选择要比较的港口 /
        货物。比如，选择——堆存港口=杭州港——会进行在杭州杠不同货物的吞吐量对比，而选择——货物名称=茶叶——会进行在所有堆存港口对茶叶的吞吐量对比。
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        1. 导入数据之前需要先登录账号。
        <br />
        2. 点击 MySql 选项。
        <br />
        3. 输入用户名（database
        user）、密码、主机名（访问地址），然后点击测试连接。通过测试之后就可以连接数据库进行下一步的操作。
        <br />
        4. 选择源数据所在的数据库和数据表，然后提交进入下一步。
        <br />
        5. 选择目标数据表（比如，源数据里存放的是客户信息的数据，那么在这选择
        “客户信息”，把元数据的每条数据记录导入系统的 “客户信息”
        表里）。点击确定到下一步。
        <br />
        6.
        选择对应的列，（左边是系统数据表的列名，而右边可以选择对应的源数据的列名）。比如，源数据的列名
        username 存放着 “客户名称”，那么在 “客户名称” 的选项选择
        username。点击提交开始导入数据。
        <br />
        7. 导入数据的时候，用户可以推出页面，也可以等待导入完成查看结果（成功 /
        半成功 /
        失败）。成功——所有数据都成功导入系统数据库，半成功——存在不合格的数据，失败——其他因素导致导入失败。
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        1. 导入数据之前需要先登录账号。
        <br />
        2. 点击 MinIO 选项。
        <br />
        3.
        输入主机名（访问地址）、用户名、密码，然后点击测试连接。通过测试之后就可以连接
        MinIO 进行下一步的操作。
        <br />
        4. 选择源数据所在的 bucket（桶）和文件，然后提交进入下一步。
        <br />
        5. 选择目标数据表（比如，源数据里存放的是物流公司的数据，那么在这选择
        “物流公司”，把元数据的每条数据记录导入系统的 “物流公司”
        表里）。然后选择源数据的文件类型，如果文件类型为 excel 表，则需要选择此
        excel 文件的哪个工作表。点击确定到下一步。
        <br />
        6.
        选择对应的列，（左边是系统数据表的列名，而右边可以选择对应的源数据的列名）。比如，源数据的列名
        company 存放着 “公司名称”，那么在 “公司名称” 的选项选择
        company。点击提交开始导入数据。
        <br />
        7. 导入数据的时候，用户可以推出页面，也可以等待导入完成查看结果（成功 /
        半成功 /
        失败）。成功——所有数据都成功导入系统数据库，半成功——存在不合格的数据，失败——其他因素导致导入失败。
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        1. 导入数据之前需要先登录账号。
        <br />
        2. 点击 HDFS 选项。
        <br />
        3.
        输入节点名（访问地址）、用户名、远端（格式：remote:/），然后点击测试连接。通过测试之后就可以连接
        HDFS 进行下一步的操作。
        <br />
        4. 选择源数据对应的文件，然后提交进入下一步。
        <br />
        5. 选择目标数据表（比如，源数据里存放的是物流信息的数据，那么在这选择
        “物流信息”，把元数据的每条数据记录导入系统的 “物流信息”
        表里）。然后选择源数据的文件类型，如果文件类型为 excel 表，则需要选择此
        excel 文件的哪个工作表。点击确定到下一步。
        <br />
        6.
        选择对应的列，（左边是系统数据表的列名，而右边可以选择对应的源数据的列名）。比如，源数据的列名
        owner 存放着 “货主名称”，那么在 “货主名称” 的选项选择
        owner。点击提交开始导入数据。
        <br />
        7. 导入数据的时候，用户可以推出页面，也可以等待导入完成查看结果（成功 /
        半成功 /
        失败）。成功——所有数据都成功导入系统数据库，半成功——存在不合格的数据，失败——其他因素导致导入失败。
      </CustomTabPanel>
      <CustomTabPanel value={value} index={4}>
        1. 导入数据之前需要先登录账号。
        <br />
        2. 点击 本地文件上传 选项。
        <br />
        3. 选择目标数据表（比如，源数据里存放的是物流信息的数据，那么在这选择
        “物流信息”，把元数据的每条数据记录导入系统的 “物流信息”
        表里）。然后选择源数据的文件类型，如果文件类型为 excel 表，则需要选择此
        excel 文件的哪个工作表。点击确定到下一步。
        <br />
        4.
        选择对应的列，（左边是系统数据表的列名，而右边可以选择对应的源数据的列名）。比如，源数据的列名
        owner 存放着 “货主名称”，那么在 “货主名称” 的选项选择
        owner。点击提交开始导入数据。
        <br />
        5. 导入数据的时候，用户可以推出页面，也可以等待导入完成查看结果（成功 /
        半成功 /
        失败）。成功——所有数据都成功导入系统数据库，半成功——存在不合格的数据，失败——其他因素导致导入失败。
      </CustomTabPanel>
      <CustomTabPanel value={value} index={5}>
        1. 修改数据之前需要先登录账号。
        <br />
        2. 在上方的功能栏，点击 处理错误记录，然后选择要处理的系统数据库表格。
        <br />
        3. 在页面右上方的 “一键修改” 功能，用户可以
        “一键去重”（删除所有违规唯一性约束的数据记录），和
        “一键删除”（删除所有错误数据）。
        <br />
        4.
        用户也可以点击选择要处理的数据记录，在右上方选择修改或者删除。选择多条数据记录只能删除，而修改仅限于逐条数据修改。
      </CustomTabPanel>
      <CustomTabPanel value={value} index={6}>
        1. 点击（?）按钮会显示出共享数据库的信息，如用户名、密码等。
        <br />
        2. 点击下载按钮会生成一个 excel 文件，用户可以下载到本地。
        <br />
        3. 用户也可以使用已提供的界面进行在线查询数据库。
        <br />
        4. 像执行较复杂的 Sql 查询，可以点击 “自行输入 SQL 语句” 进行查询。
        <br />
        5. 注：在输入 Sql 语句的时候，记得使用 Schema，如：SELECT * FROM
        DT.客户信息; 其中 DT 为本 Schema 名称。
      </CustomTabPanel>
    </Box>
  );
}
