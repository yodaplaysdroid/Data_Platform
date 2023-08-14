import {
  TextField,
  Button,
  Select,
  MenuItem,
  Typography,
  LinearProgress,
  Snackbar,
  IconButton,
  Alert,
  SelectChangeEvent,
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };
  const [writeTable, setWriteTable] = useState("");
  const [fileType, setFileType] = useState("");
  const [sheetName, setSheetName] = useState("");

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

  function handleUpload() {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      fetch("http://36.140.31.145:31684/local_input/send_file/", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setSnackbarStatus(true);
          if (data.status === 0) {
            setAlert(
              <Alert severity="success" action={action}>
                上传成功！
              </Alert>
            );
          } else {
            setAlert(
              <Alert severity="error" action={action}>
                上传失败
              </Alert>
            );
          }
          setPage(2);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }
  function handleFileType(e: SelectChangeEvent<string>) {
    setFileType(e.target.value);
    if (e.target.value == "xls") {
      fetch("http://36.140.31.145:31684/local_input/get_sheets/")
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
        filetype: fileType,
        sheetname: sheetName,
        writetable: writeTable,
      }),
    };
    console.log(requestOptions);
    fetch("http://36.140.31.145:31684/local_input/get_columns/", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        let tmp = [data.columns1, data.columns2];
        setColumns(tmp);
        setChecked(Array(tmp[1].length).fill(""));
        setPage(3);
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
        filetype: fileType,
        writetable: writeTable,
        sheetname: sheetName,
        usecolumns: checked,
        user: localStorage.getItem("user"),
      }),
    };
    console.log(requestOptions);
    fetch(
      "http://36.140.31.145:31684/local_input/data_transfer/",
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
        本地上传
      </Typography>
      {loading}
      {page === 1 ? (
        <>
          <TextField
            type="file"
            onChange={handleFileChange}
            label="文件上传"
            InputLabelProps={{ shrink: true }}
            sx={{ marginTop: 2 }}
            fullWidth
          />
          <Button fullWidth sx={{ marginTop: 2 }} onClick={handleUpload}>
            <Typography variant="h6">上传</Typography>
          </Button>
        </>
      ) : null}
      {page === 2 ? (
        <>
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
              value={fileType}
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
            {fileType === "xls" ? (
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
      {page === 3 ? (
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
