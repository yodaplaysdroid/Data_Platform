import {
  TextField,
  Button,
  Select,
  MenuItem,
  Typography,
  FormControl,
  SelectChangeEvent,
  LinearProgress,
  Snackbar,
  IconButton,
  Alert,
} from "@mui/material";
import { Fragment, useState } from "react";

const writeTables = [
  "物流公司",
  "客户信息",
  "物流信息",
  "集装箱动态",
  "装货表",
  "卸货表",
];

export default function Mysql() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [host, setHost] = useState("");
  const [database, setDatabase] = useState("");
  const [readTable, setReadTable] = useState("");
  const [writeTable, setWriteTable] = useState("");

  const [isConnected, setIsConnected] = useState(-1);
  const [databases, setDatabases] = useState([]);
  const [tables, setTables] = useState([]);
  const [page, setPage] = useState(1);
  const [columns, setColumns] = useState<any[]>([]);
  const [checked, setChecked] = useState(Array(20).fill(""));
  const [eligible, setEligible] = useState(false);
  const [loading, setLoading] = useState(
    <LinearProgress variant="determinate" value={0} />
  );
  const [snackbarStatus, setSnackbarStatus] = useState(false);
  const action = (
    <Fragment>
      <IconButton
        size="small"
        aria-label="close"
        onClick={() => setSnackbarStatus(false)}
      >
        <img src="/exit.png" style={{ height: 15 }}></img>
      </IconButton>
    </Fragment>
  );
  const action2 = (
    <Fragment>
      <Button color="warning" href={`/fix/${writeTable}`}>
        查看错误数据
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        onClick={() => setSnackbarStatus(false)}
      >
        <img src="/exit.png" style={{ height: 15 }}></img>
      </IconButton>
    </Fragment>
  );
  const [alert, setAlert] = useState(<></>);
  const [submitted, setSubmitted] = useState(false);

  function handleTest() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username,
        password: password,
        host: host,
      }),
    };
    console.log(requestOptions);
    fetch(
      "http://36.140.31.145:31684/mysql_input/test_connection/",
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setIsConnected(data.status);
        setSnackbarStatus(true);
        if (data.status === 0) {
          setAlert(
            <Alert severity="success" action={action}>
              数据库连接成功！
            </Alert>
          );
        } else {
          setAlert(
            <Alert severity="error" action={action}>
              数据库连接失败
            </Alert>
          );
        }
      });
    return;
  }
  function handleConnect() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username,
        password: password,
        host: host,
      }),
    };
    console.log(requestOptions);
    fetch(
      "http://36.140.31.145:31684/mysql_input/get_databases/",
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.status === 0) {
          setDatabases(data.databases);
          setPage(2);
        } else {
          setSnackbarStatus(true);
          setAlert(
            <Alert severity="error" action={action}>
              数据库连接失败
            </Alert>
          );
        }
      });
    return;
  }

  function handleUseDatabase(e: SelectChangeEvent) {
    setDatabase(e.target.value);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username,
        password: password,
        host: host,
        database: e.target.value,
      }),
    };
    console.log(requestOptions);
    fetch("http://36.140.31.145:31684/mysql_input/get_tables/", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.status === 0) {
          setTables(data.tables);
        } else {
          setTables([]);
        }
      });
  }
  function handleConfirm() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username,
        password: password,
        host: host,
        database: database,
        readtable: readTable,
        writetable: writeTable,
      }),
    };
    console.log(requestOptions);
    fetch("http://36.140.31.145:31684/mysql_input/get_columns/", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        let tmp = [data.columns1, data.columns2];
        setColumns(tmp);
        setChecked(Array(tmp[1].length).fill(""));
        setPage(4);
      });
  }
  function handleChange(e: any, index: number) {
    console.log(checked);
    let tmp = checked;
    tmp[index] = e.target.value;
    console.log(tmp);
    setChecked(tmp);
    setEligible(true);
    for (let c in tmp) {
      if (tmp[c] == "") {
        setEligible(false);
        break;
      }
    }
  }
  function handleSubmit() {
    setLoading(<LinearProgress />);
    setSubmitted(true);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username,
        password: password,
        host: host,
        database: database,
        readtable: readTable,
        writetable: writeTable,
        selectcolumns: checked,
        user: localStorage.getItem("user"),
      }),
    };
    console.log(requestOptions);
    fetch(
      "http://36.140.31.145:31684/mysql_input/data_transfer/",
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setLoading(<LinearProgress variant="determinate" value={100} />);
        setSnackbarStatus(true);
        if (data.status === 0) {
          setAlert(
            <Alert severity="success" action={action}>
              数据导入成功！
            </Alert>
          );
        } else if (data.status <= 0) {
          setAlert(
            <Alert severity="error" action={action2}>
              数据导入出错！
            </Alert>
          );
        } else {
          setAlert(
            <Alert severity="warning" action={action2}>
              存在 {data.status} 条异常数据！
            </Alert>
          );
        }
      });
  }

  return (
    <>
      <Typography variant="h6" sx={{ margin: "10px 0" }} align="right">
        MySQL 数据导入
      </Typography>
      {loading}
      {page === 1 ? (
        <>
          <TextField
            id="username"
            label="用户名"
            variant="standard"
            fullWidth
            sx={{ margin: "5px 0" }}
            defaultValue={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setIsConnected(1);
              setDatabases([]);
              setTables([]);
            }}
          />
          <br />
          <TextField
            id="password"
            label="密码"
            type="password"
            variant="standard"
            fullWidth
            sx={{ margin: "5px 0" }}
            defaultValue={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setIsConnected(1);
              setDatabases([]);
              setTables([]);
            }}
          />
          <br />
          <TextField
            id="host"
            label="主机名"
            variant="standard"
            fullWidth
            sx={{ margin: "5px 0" }}
            defaultValue={host}
            onChange={(e) => {
              setHost(e.target.value);
              setIsConnected(1);
              setDatabases([]);
              setTables([]);
            }}
          />
          <br />
          <Button fullWidth onClick={handleTest}>
            <Typography variant="h6">测试连接</Typography>
          </Button>
          <br />
          {isConnected === 0 ? (
            <Button fullWidth onClick={handleConnect}>
              <Typography variant="h6">连接数据库</Typography>
            </Button>
          ) : (
            <Button fullWidth disabled>
              <Typography variant="h6">连接数据库</Typography>
            </Button>
          )}
        </>
      ) : null}
      {page === 2 && databases.length !== 0 ? (
        <>
          <FormControl fullWidth>
            <Select
              value={database}
              onChange={handleUseDatabase}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
              sx={{ margin: "5px 0" }}
            >
              <MenuItem value="">
                <em>选择数据库</em>
              </MenuItem>
              {databases.map((item) => (
                <MenuItem value={item}>{item}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <Select
              value={readTable}
              onChange={(e) => setReadTable(e.target.value)}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
              sx={{ margin: "5px 0" }}
            >
              <MenuItem value="">
                <em>选择输入表</em>
              </MenuItem>
              {tables.map((item) => (
                <MenuItem value={item}>{item}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {readTable !== "" && database !== "" ? (
            <Button
              fullWidth
              onClick={() => {
                setPage(3);
              }}
            >
              <Typography variant="h6">提交</Typography>
            </Button>
          ) : (
            <Button disabled fullWidth>
              <Typography variant="h6">提交</Typography>
            </Button>
          )}
        </>
      ) : null}
      {page === 3 ? (
        <>
          <Typography
            variant="button"
            sx={{
              fontSize: 18,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>{"用户名: "}</div>
            <div>{username}</div>
          </Typography>
          <br />
          <Typography
            variant="button"
            sx={{
              fontSize: 18,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>{"主机名: "}</div>
            <div>{host}</div>
          </Typography>
          <br />
          <Typography
            variant="button"
            sx={{
              fontSize: 18,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>{"数据库: "}</div>
            <div>{database}</div>
          </Typography>
          <br />
          <Typography
            variant="button"
            sx={{
              fontSize: 18,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>{"源数据表: "}</div>
            <div>{readTable}</div>
          </Typography>
          <br />
          <Typography
            variant="button"
            sx={{
              fontSize: 18,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>{"目标数据表: "}</div>

            <Select
              value={writeTable}
              onChange={(e) => setWriteTable(e.target.value)}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
              size="small"
              sx={{ marginLeft: "20px", width: 150 }}
            >
              <MenuItem value="">
                <em>选择</em>
              </MenuItem>
              {writeTables.map((item) => (
                <MenuItem value={item}>{item}</MenuItem>
              ))}
            </Select>
          </Typography>
          <br />
          {writeTable !== "" && !submitted ? (
            <Button fullWidth onClick={handleConfirm}>
              <Typography variant="h6">确定</Typography>
            </Button>
          ) : (
            <Button disabled fullWidth>
              <Typography variant="h6">确定</Typography>
            </Button>
          )}
        </>
      ) : null}
      {page === 4 ? (
        <>
          {columns[1].map((item: string, index: number) => (
            <Typography
              variant="button"
              sx={{
                fontSize: 18,
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                marginTop: 1,
                marginBottom: 1,
              }}
            >
              <div>
                {item}
                {": "}
              </div>

              <Select
                onChange={(e) => handleChange(e, index)}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                size="small"
                sx={{ marginLeft: "20px", width: 150 }}
                defaultValue={checked[index]}
              >
                <MenuItem value=""></MenuItem>
                {columns[0].map((item: string) => (
                  <MenuItem value={item}>{item}</MenuItem>
                ))}
              </Select>
            </Typography>
          ))}

          {eligible ? (
            <Button fullWidth onClick={handleSubmit}>
              <Typography variant="h6">提交</Typography>
            </Button>
          ) : (
            <Button fullWidth disabled>
              <Typography variant="h6">提交</Typography>
            </Button>
          )}
        </>
      ) : null}
      <Snackbar open={snackbarStatus}>{alert}</Snackbar>
    </>
  );
}
