import { Button, Link, MenuItem, Select, TextField } from "@mui/material";
import { useState } from "react";

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

  const [page, setPage] = useState(["Minio Input"]);
  const [isConnected, setIsConnected] = useState(1);
  const [buckets, setBuckets] = useState([]);
  const [files, setFiles] = useState([]);

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
        if (data.status === 0) {
          setIsConnected(0);
        } else {
          setIsConnected(1);
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
    fetch("http://36.140.31.145:31810/minio_input/get_buckets", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.status === 0) {
          setBuckets(data.buckets);
          setPage(page.concat(["Buckets"]));
        } else {
          setBuckets([]);
        }
      });
  }
  function handleUseBucket(e: React.MouseEvent) {
    setBucket(e.currentTarget.id);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        endpoint: endpoint,
        accesskey: accessKey,
        secretkey: secretKey,
        bucket: e.currentTarget.id,
      }),
    };
    console.log(requestOptions);
    fetch("http://36.140.31.145:31810/minio_input/get_files", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.status === 0) {
          setFiles(data.objects);
          setPage(page.concat(["Files"]));
        } else {
          setFiles([]);
        }
      });
  }
  function handleUseFile(e: React.MouseEvent) {
    setDirectory(e.currentTarget.id);
    setPage(page.concat(["Configurations"]));
  }
  function handleSubmit(e: React.MouseEvent) {
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
      });
  }
  function handlePageChange(e: MouseEvent) {
    let tmp = [];
    for (let i in page) {
      tmp.push(page[i]);
      if (page[i] === e.currentTarget.id) {
        break;
      }
    }
    setPage(tmp);
  }
  return (
    <>
      <a href="/">Menu</a>
      {" / "}
      {page.map((item, index) => (
        <>
          <Link
            id={item}
            underline="hover"
            color="inherit"
            onClick={handlePageChange}
          >
            {item}
          </Link>
          {" / "}
        </>
      ))}
      {page.length === 1 ? (
        <>
          <h1>MinIO Input</h1>
          <TextField
            id="endpoint"
            label="Endpoint"
            variant="standard"
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
            defaultValue={secretKey}
            onChange={(e) => {
              setSecretKey(e.target.value);
              setIsConnected(1);
            }}
          />
          <br />
          <Button onClick={handleTest}>Test Connection</Button>
          <br />
          {isConnected === 0 ? (
            <Button onClick={handleConnect}>Connect</Button>
          ) : (
            <Button disabled>Connect</Button>
          )}
          <br />
        </>
      ) : null}
      {page.length === 2 && buckets.length !== 0 ? (
        <>
          <h2>Buckets</h2>
          <ul>
            {buckets.map((item, index) => (
              <li key={index}>
                <Button id={item} onClick={handleUseBucket}>
                  {item}
                </Button>
              </li>
            ))}
          </ul>
        </>
      ) : null}
      {page.length === 3 && files.length !== 0 ? (
        <>
          <h2>{bucket}</h2>
          <ul>
            {files.map((item, index) => (
              <li key={index}>
                <Button id={item} onClick={handleUseFile}>
                  {item}
                </Button>
              </li>
            ))}
          </ul>
        </>
      ) : null}
      {page.length === 4 ? (
        <>
          <h2>
            {bucket}
            {" -> "}
            {directory}
          </h2>
          <Select
            value={filetype}
            onChange={(e) => setFiletype(e.target.value)}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
            size="small"
          >
            <MenuItem value="">
              <em>Filetype</em>
            </MenuItem>
            <MenuItem value="csv">CSV</MenuItem>
            <MenuItem value="xls">EXCEL</MenuItem>
            <MenuItem value="txt">TSV</MenuItem>
          </Select>
          <br />
          <Select
            value={writeTable}
            onChange={(e) => setWriteTable(e.target.value)}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
            size="small"
          >
            <MenuItem value="">
              <em>Write Table</em>
            </MenuItem>
            {writeTables.map((item) => (
              <MenuItem value={item}>{item}</MenuItem>
            ))}
          </Select>
          <br />
          {filetype === "xls" ? (
            <TextField
              id="sheetName"
              label="SheetName"
              variant="standard"
              defaultValue={sheetName}
              onChange={(e) => {
                setSheetName(e.target.value);
                setIsConnected(1);
              }}
            />
          ) : null}
          <br />
          {writeTable !== "" ? (
            <Button onClick={handleSubmit}>Submit</Button>
          ) : null}
        </>
      ) : null}
    </>
  );
}
