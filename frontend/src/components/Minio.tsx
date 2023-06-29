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
      <Button color="warning" href="/">
        处理
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
      "http://36.140.31.145:31810/minio_input/test_connection/",
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
    fetch("http://36.140.31.145:31810/minio_input/get_buckets/", requestOptions)
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
    fetch("http://36.140.31.145:31810/minio_input/get_files/", requestOptions)
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
      }),
    };
    console.log(requestOptions);
    fetch(
      "http://36.140.31.145:31810/minio_input/data_transfer/",
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
            <Alert severity="error" action={action}>
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
            label="Endpoint"
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
            label="AccessKey"
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
            label="SecretKey"
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
          <Typography variant="button" sx={{ fontSize: 18, display: "flex" }}>
            endpoint: {endpoint}
          </Typography>
          <Typography variant="button" sx={{ fontSize: 18, display: "flex" }}>
            access key: {accessKey}
          </Typography>
          <Typography variant="button" sx={{ fontSize: 18, display: "flex" }}>
            secret key: {secretKey}
          </Typography>
          <Typography variant="button" sx={{ fontSize: 18, display: "flex" }}>
            bucket: {bucket}
          </Typography>
          <Typography variant="button" sx={{ fontSize: 18, display: "flex" }}>
            directory: {directory}
          </Typography>
          <Typography variant="button" sx={{ fontSize: 18, display: "flex" }}>
            write table:{" "}
            <Select
              value={writeTable}
              onChange={(e) => setWriteTable(e.target.value)}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
              size="small"
              sx={{ marginLeft: "20px" }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {writeTables.map((item) => (
                <MenuItem value={item}>{item}</MenuItem>
              ))}
            </Select>
          </Typography>
          <Typography variant="button" sx={{ fontSize: 18, display: "flex" }}>
            file type:{" "}
            <Select
              value={filetype}
              onChange={(e) => setFiletype(e.target.value)}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
              size="small"
              sx={{ marginLeft: "20px" }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="csv">CSV</MenuItem>
              <MenuItem value="xls">EXCEL</MenuItem>
              <MenuItem value="txt">TSV</MenuItem>
            </Select>
          </Typography>
          <Typography
            variant="button"
            sx={{ fontSize: 18, display: "flex" }}
          ></Typography>
          {filetype === "xls" ? (
            <TextField
              id="sheetName"
              label="Sheet Name"
              variant="standard"
              defaultValue={sheetName}
              onChange={(e) => setSheetName(e.target.value)}
            />
          ) : (
            <TextField
              id="sheetName"
              label="Sheet Name"
              variant="standard"
              disabled
              defaultValue={sheetName}
            />
          )}
          <br />
          {writeTable !== "" && !submitted ? (
            <Button fullWidth onClick={handleSubmit}>
              <Typography variant="h6">提交</Typography>
            </Button>
          ) : (
            <Button disabled fullWidth>
              <Typography variant="h6">提交</Typography>
            </Button>
          )}
        </>
      ) : null}
      <Snackbar open={snackbarStatus}>{alert}</Snackbar>
    </>
  );
}
