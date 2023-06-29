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

export default function Hdfs() {
  const [directory, setDirectory] = useState("hdp:/");
  const [filename, setFilename] = useState("");
  const [filetype, setFiletype] = useState("");
  const [writeTable, setWriteTable] = useState("");
  const [sheetName, setSheetName] = useState("");

  const [page, setPage] = useState(["HDFS Input"]);
  const [isConnected, setIsConnected] = useState(1);
  const [files, setFiles] = useState([]);

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

  function handleTest(e: React.MouseEvent) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        directory: directory,
      }),
    };
    console.log(requestOptions);
    fetch(
      "http://36.140.31.145:31810/hdfs_input/test_connection/",
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.status === 0) {
          setIsConnected(0);
          setFiles(data.files);
        } else {
          setIsConnected(1);
        }
      });
  }

  function handleConnect(e: React.MouseEvent) {
    setPage(page.concat(["Files"]));
  }

  function handleUseFile(e: React.MouseEvent) {
    setFilename(e.currentTarget.id);
    setPage(page.concat(["Configurations"]));
  }

  function handleSubmit(e: React.MouseEvent) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        directory: directory,
        filename: filename,
        filetype: filetype,
        writetable: writeTable,
        sheetname: sheetName,
      }),
    };
    console.log(requestOptions);
    fetch(
      "http://36.140.31.145:31810/hdfs_input/data_transfer/",
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
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
          <h1>Mysql Input</h1>
          <TextField
            id="endpoint"
            label="Endpoint"
            variant="standard"
            defaultValue="hadoopa-namenode.damenga-zone.svc:9000"
            onChange={(e) => {
              setIsConnected(1);
            }}
          />
          <br />
          <TextField
            id="directory"
            label="Directory"
            variant="standard"
            defaultValue={directory}
            onChange={(e) => {
              setDirectory(e.target.value);
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
      {page.length === 2 && files.length !== 0 ? (
        <>
          <h2>Files</h2>
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
      {page.length === 3 ? (
        <>
          <h2>
            {directory}
            {" -> "}
            {filename}
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
