import {
  Alert,
  Button,
  FormControl,
  IconButton,
  LinearProgress,
  MenuItem,
  Select,
  SelectChangeEvent,
  Snackbar,
  TextField,
  Typography,
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

export default function Minio() {
  const [endpoint, setEndpoint] = useState("minio.damenga-zone.svc");
  const [secretKey, setSecretKey] = useState("Cnsoft15195979130");
  const [accessKey, setAccessKey] = useState("cnsof17014913");
  const [bucket, setBucket] = useState("");
  const [directory, setDirectory] = useState("");
  const [filetype, setFiletype] = useState("");
  const [writeTable, setWriteTable] = useState("");
  const [sheetName, setSheetName] = useState("");

  const [isConnected, setIsConnected] = useState(1);
  const [buckets, setBuckets] = useState([]);
  const [files, setFiles] = useState([]);
  const [page, setPage] = useState(1);
  const [columns, setColumns] = useState<any[]>([]);
  const [checked, setChecked] = useState(Array(20).fill(""));
  const [eligible, setEligible] = useState(false);
  const [sheets, setSheets] = useState<any[]>([]);
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
        endpoint: endpoint,
        accesskey: accessKey,
        secretkey: secretKey,
      }),
    };
    console.log(requestOptions);
    fetch(
      "http://36.140.31.145:31684/minio_input/test_connection/",
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
  }
  function handleConnect() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        endpoint: endpoint,
        accesskey: accessKey,
        secretkey: secretKey,
      }),
    };
    console.log(requestOptions);
    fetch("http://36.140.31.145:31684/minio_input/get_buckets/", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.status === 0) {
          setBuckets(data.buckets);
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
  }
  function handleUseBucket(e: SelectChangeEvent) {
    setBucket(e.target.value);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        endpoint: endpoint,
        accesskey: accessKey,
        secretkey: secretKey,
        bucket: e.target.value,
      }),
    };
    console.log(requestOptions);
    fetch("http://36.140.31.145:31684/minio_input/get_files/", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.status === 0) {
          setFiles(data.objects);
        } else {
          setFiles([]);
        }
      });
  }
  function handleFileType(e: SelectChangeEvent<string>) {
    setFiletype(e.target.value);
    if (e.target.value == "xls") {
      fetch("http://36.140.31.145:31684/minio_input/get_sheets/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: endpoint,
          accesskey: accessKey,
          secretkey: secretKey,
          bucket: bucket,
          directory: directory,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setSheets(data.results);
        });
    }
  }
  function handleConfirm() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        endpoint: endpoint,
        accesskey: accessKey,
        secretkey: secretKey,
        bucket: bucket,
        directory: directory,
        filetype: filetype,
        writetable: writeTable,
        sheetname: sheetName,
      }),
    };
    console.log(requestOptions);
    fetch("http://36.140.31.145:31684/minio_input/get_columns/", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        let tmp = [data.columns1, data.columns2];
        setColumns(tmp);
        setChecked(Array(tmp[0].length).fill(""));
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
        endpoint: endpoint,
        accesskey: accessKey,
        secretkey: secretKey,
        bucket: bucket,
        directory: directory,
        filetype: filetype,
        writetable: writeTable,
        sheetname: sheetName,
        usecolumns: checked,
      }),
    };
    console.log(requestOptions);
    fetch(
      "http://36.140.31.145:31684/minio_input/data_transfer/",
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
        MinIO 数据导入
      </Typography>
      {loading}
      {page === 1 ? (
        <>
          <TextField
            id="endpoint"
            label="主机名"
            variant="standard"
            fullWidth
            sx={{ margin: "5px 0" }}
            defaultValue={endpoint}
            onChange={(e) => {
              setEndpoint(e.target.value);
              setIsConnected(1);
            }}
          />
          <br />
          <TextField
            id="accessKey"
            label="用户名"
            variant="standard"
            fullWidth
            sx={{ margin: "5px 0" }}
            defaultValue={accessKey}
            onChange={(e) => {
              setAccessKey(e.target.value);
              setIsConnected(1);
            }}
          />
          <br />
          <TextField
            id="secretKey"
            label="密码"
            type="password"
            variant="standard"
            fullWidth
            sx={{ margin: "5px 0" }}
            defaultValue={secretKey}
            onChange={(e) => {
              setSecretKey(e.target.value);
              setIsConnected(1);
            }}
          />
          <br />
          <Button fullWidth onClick={handleTest}>
            <Typography variant="h6">测试连接</Typography>
          </Button>
          <br />
          {isConnected === 0 ? (
            <Button fullWidth onClick={handleConnect}>
              <Typography variant="h6">连接 MinIO</Typography>
            </Button>
          ) : (
            <Button fullWidth disabled>
              <Typography variant="h6">连接 MinIO</Typography>
            </Button>
          )}
          <br />
        </>
      ) : null}
      {page === 2 && buckets.length !== 0 ? (
        <>
          <FormControl fullWidth>
            <Select
              value={bucket}
              onChange={handleUseBucket}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
              sx={{ margin: "5px 0" }}
            >
              <MenuItem value="">
                <em>选择 Bucket</em>
              </MenuItem>
              {buckets.map((item) => (
                <MenuItem value={item}>{item}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <Select
              value={directory}
              onChange={(e) => setDirectory(e.target.value)}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
              sx={{ margin: "5px 0" }}
            >
              <MenuItem value="">
                <em>选择文件</em>
              </MenuItem>
              {files.map((item) => (
                <MenuItem value={item}>{item}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {directory !== "" && bucket !== "" ? (
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
            <div>{"主机名: "}</div>
            <div>{endpoint}</div>
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
            <div>{"用户名: "}</div>
            <div>{accessKey}</div>
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
            <div>{"桶: "}</div>
            <div>{bucket}</div>
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
            <div>{"目录: "}</div>
            <div>{directory}</div>
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
              sx={{ marginLeft: "20px", width: 200 }}
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
          <Typography
            variant="button"
            sx={{
              fontSize: 18,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>{"文件类型: "}</div>
            <Select
              value={filetype}
              onChange={handleFileType}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
              size="small"
              sx={{ marginLeft: "20px", width: 200 }}
            >
              <MenuItem value="">
                <em>选择</em>
              </MenuItem>
              <MenuItem value="csv">CSV</MenuItem>
              <MenuItem value="xls">EXCEL</MenuItem>
              <MenuItem value="txt">TSV</MenuItem>
            </Select>
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
            <div>{"工作表名称: "}</div>
            {filetype === "xls" ? (
              <Select
                value={sheetName}
                onChange={(e) => setSheetName(e.target.value)}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                size="small"
                sx={{ marginLeft: "20px", width: 200 }}
              >
                <MenuItem value=""></MenuItem>
                {sheets.map((item) => (
                  <MenuItem value={item}>{item}</MenuItem>
                ))}
              </Select>
            ) : (
              <Select
                defaultValue={""}
                disabled
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                size="small"
                sx={{ marginLeft: "20px", width: 200 }}
              >
                <MenuItem value=""></MenuItem>
              </Select>
            )}
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
