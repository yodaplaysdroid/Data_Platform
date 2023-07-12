import {
  Alert,
  Button,
  Card,
  CardContent,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  LinearProgress,
  MenuItem,
  Select,
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

export default function Hdfs() {
  const [directory, setDirectory] = useState("hdp:/");
  const [namenode, setNamenode] = useState(
    "hadoopa-namenode.damenga-zone.svc:9000"
  );
  const [username, setUsername] = useState("root");
  const [filename, setFilename] = useState("");
  const [filetype, setFiletype] = useState("");
  const [writeTable, setWriteTable] = useState("");
  const [sheetName, setSheetName] = useState("");

  const [isConnected, setIsConnected] = useState(1);
  const [files, setFiles] = useState([]);
  const [page, setPage] = useState(1);
  const [columns, setColumns] = useState<any[]>([]);
  const [checked, setChecked] = useState<number[]>([]);
  const [countones, setCountones] = useState(0);
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
        directory: directory,
        namenode: namenode,
        username: username,
      }),
    };
    console.log(requestOptions);
    fetch(
      "http://36.140.31.145:31684/hdfs_input/test_connection/",
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setIsConnected(data.status);
        setSnackbarStatus(true);
        if (data.status === 0) {
          setFiles(data.files);
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
  function handleConfirm() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        directory: directory,
        namenode: namenode,
        username: username,
        filename: filename,
        filetype: filetype,
        writetable: writeTable,
        sheetname: sheetName,
      }),
    };
    console.log(requestOptions);
    fetch("http://36.140.31.145:31684/hdfs_input/get_columns/", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        let tmp = [data.columns1, data.columns2];
        setColumns(tmp);
        setChecked(Array(tmp[0].length).fill(1));
        setCountones(tmp[0].length);
        setPage(4);
      });
  }
  function handleChange(e: any) {
    console.log(e.target.id);
    let tmp = checked;
    tmp[Number(e.target.id)] === 0
      ? (tmp[Number(e.target.id)] = 1)
      : (tmp[Number(e.target.id)] = 0);
    setChecked(tmp);
    const countOnes = checked.reduce((count, element) => {
      if (element === 1) {
        return count + 1;
      }
      return count;
    }, 0);
    setCountones(countOnes);
    console.log(checked, countOnes);
  }
  function handleSubmit() {
    setLoading(<LinearProgress />);
    setSubmitted(true);
    let deleteColumns: string[] = [];
    for (let c in checked) {
      if (checked[c] === 0) {
        deleteColumns.push(columns[0][c]);
      }
    }
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        directory: directory,
        namenode: namenode,
        username: username,
        filename: filename,
        filetype: filetype,
        writetable: writeTable,
        sheetname: sheetName,
        deletecolumns: deleteColumns,
      }),
    };
    console.log(requestOptions);
    fetch(
      "http://36.140.31.145:31684/hdfs_input/data_transfer/",
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
        HDFS 数据导入
      </Typography>
      {loading}
      {page === 1 ? (
        <>
          <TextField
            id="namenode"
            label="Namenode"
            variant="standard"
            fullWidth
            sx={{ margin: "5px 0" }}
            defaultValue={namenode}
            onChange={(e) => {
              setNamenode(e.target.value);
              setIsConnected(1);
            }}
          />
          <br />
          <TextField
            id="username"
            label="Username"
            variant="standard"
            fullWidth
            sx={{ margin: "5px 0" }}
            defaultValue={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setIsConnected(1);
            }}
          />
          <br />
          <TextField
            id="directory"
            label="Directory"
            variant="standard"
            fullWidth
            sx={{ margin: "5px 0" }}
            defaultValue={directory}
            onChange={(e) => {
              setDirectory(e.target.value);
              setIsConnected(1);
            }}
          />
          <br />
          <Button fullWidth onClick={handleTest}>
            <Typography variant="h6">测试连接</Typography>
          </Button>
          <br />
          {isConnected === 0 ? (
            <Button fullWidth onClick={() => setPage(2)}>
              <Typography variant="h6">连接 HDFS</Typography>
            </Button>
          ) : (
            <Button fullWidth disabled>
              <Typography variant="h6">连接 HDFS</Typography>
            </Button>
          )}
          <br />
        </>
      ) : null}
      {page === 2 && files.length !== 0 ? (
        <>
          <FormControl fullWidth>
            <Select
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
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
          {filename !== "" && directory !== "" ? (
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
            endpoint: hadoopa-namenode.damenga-zone.svc:9000
          </Typography>
          <br />
          <Typography variant="button" sx={{ fontSize: 18, display: "flex" }}>
            directory: {directory}
          </Typography>
          <br />
          <Typography variant="button" sx={{ fontSize: 18, display: "flex" }}>
            filename: {filename}
          </Typography>
          <br />
          <Typography variant="button" sx={{ fontSize: 18, display: "flex" }}>
            filetype:{" "}
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
          <br />
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
          <br />

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
          <Container
            sx={{
              display: "flex",
              justifyContent: "space-around",
              marginTop: 5,
              marginBottom: 5,
            }}
          >
            <Card id="columns1" sx={{ width: 250 }}>
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  源数据表
                </Typography>
                <FormGroup>
                  {columns[0].map((item: string, index: number) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          defaultChecked
                          id={index.toString()}
                          onChange={handleChange}
                        />
                      }
                      label={item}
                    />
                  ))}
                </FormGroup>
              </CardContent>
            </Card>
            <Card id="columns1" sx={{ width: 250 }}>
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  目标数据表
                </Typography>
                {columns[1].map((item: string) => (
                  <MenuItem value={item}>{item}</MenuItem>
                ))}
              </CardContent>
            </Card>
          </Container>

          {columns[1].length === countones ? (
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
