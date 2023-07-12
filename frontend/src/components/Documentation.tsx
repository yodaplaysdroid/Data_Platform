import { Typography } from "@mui/material";

export default function Documentation() {
  return (
    <>
      <Typography align="center" variant="h5">
        使用手册
      </Typography>
      <br />
      <Typography align="center" variant="h6">
        1. 输入数据
      </Typography>
      <br />
      <Typography align="center" variant="body1">
        第一步，先点击任务栏中的 “数据导入”，然后选择想要导入数据的数据源
      </Typography>
      <br />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img src="/doc1.png" style={{ width: 1000 }} />
      </div>
      <br />
      <Typography align="center" variant="body1">
        第二步，填入所需的用户名、密码、主机名等，然后点击 “测试连接”
        进行连接测试。
        <br />
        当连接测试成功之后，就可以访问数据源采取数据。
      </Typography>
      <br />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img src="/doc2.png" style={{ width: 1000 }} />
      </div>
      <br />
      <Typography align="center" variant="body1">
        第三步，选择想要导入数据的数据库 / 文件 / 目录等，接着点击提交提取数据。
      </Typography>
      <br />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img src="/doc3.png" style={{ width: 1000 }} />
      </div>
      <br />
      <Typography align="center" variant="body1">
        第四步，选择要把数据导入进系统数据库的哪个表，此步骤请务必小心，避免系统的数据错误。
      </Typography>
      <br />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img src="/doc4.png" style={{ width: 1000 }} />
      </div>
      <br />
      <Typography align="center" variant="body1">
        第五步，选择数据源的表的属性进行接入，防止数据源与系统数据的列不匹配。
      </Typography>
      <br />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img src="/doc5.png" style={{ width: 1000 }} />
      </div>
      <br />
      <Typography align="center" variant="body1">
        数据导入之后，如果有数据出错，可以点击 “查看错误数据”
        进行进一步的数据治理。
      </Typography>
      <br />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img src="/doc6.png" style={{ width: 1000 }} />
      </div>
      <br />
      <Typography align="center" variant="body1">
        在数据治理界面，可以点击右上角的 “三条横线” 打开一键治理功能。
      </Typography>
      <br />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img src="/doc7.png" style={{ width: 1000 }} />
      </div>
      <br />
      <Typography align="center" variant="body1">
        目前，一键治理功能支持一键清除所有错误数据和一键去重。
      </Typography>
      <br />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img src="/doc10.png" style={{ width: 1000 }} />
      </div>
      <br />
      <Typography align="center" variant="body1">
        除了一键治理，用户还可以按条治理。点击 “笔” 可以修改数据，而 “回收站”
        可以快速清理算则数据项。
        <br />
        常见的错误类型有 6602-“违规了唯一性”，6607-“违规外键约束”。
        <br />
        注：数据接入顺序为：物流公司、客户信息、物流信息、集装箱动态、装货表、卸货表
      </Typography>
      <br />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img src="/doc8.png" style={{ width: 1000 }} />
      </div>
      <br />
      <Typography align="center" variant="body1">
        完成修改后，点击提交修改数据。如果修改后仍是不合规范，则此数据依旧会保存在错误信息的表里。
      </Typography>
      <br />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img src="/doc9.png" style={{ width: 1000 }} />
      </div>
      <br />
      <Typography align="center" variant="body1">
        任务栏的五个按键：主页、数据库共享、数据治理、数据导入、文档手册
      </Typography>
      <br />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img src="/doc11.png" style={{ width: 1000 }} />
      </div>
      <br />
      <Typography align="center" variant="body1">
        在主页的分析表里，用户可以通过选项表进行试图更改。
      </Typography>
      <br />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img src="/doc12.png" style={{ width: 1000 }} />
      </div>
      <br />
    </>
  );
}
