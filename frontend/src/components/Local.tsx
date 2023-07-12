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
  Card,
  CardContent,
  Container,
  Checkbox,
  FormControlLabel,
  FormGroup,
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
        setChecked(Array(tmp[0].length).fill(1));
        setCountones(tmp[0].length);
        setPage(3);
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
    console.log(deleteColumns);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filetype: fileType,
        writetable: writeTable,
        sheetname: sheetName,
        deletecolumns: deleteColumns,
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
            上传
          </Button>
        </>
      ) : null}
      {page === 2 ? (
        <>
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
          <Typography variant="button" sx={{ fontSize: 18, display: "flex" }}>
            file type:{" "}
            <Select
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
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
          {fileType === "xls" ? (
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
      {page === 3 ? (
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
