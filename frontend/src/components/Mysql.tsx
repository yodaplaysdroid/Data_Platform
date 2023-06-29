import { TextField, Button, Select, MenuItem, Link } from "@mui/material";
import { useState } from "react";

const writeTables = [
  "物流公司",
  "客户信息",
  "物流信息",
  "集装箱动态",
  "装货表",
  "卸货表",
];

export default function Mysql() {
  const [username, setUsername] = useState("mysqluser");
  const [password, setPassword] = useState("Dameng123");
  const [host, setHost] = useState("mysqla-mysqld.damenga-zone.svc");
  const [isConnected, setIsConnected] = useState(-1);
  const [databases, setDatabases] = useState([]);
  const [tables, setTables] = useState([]);
  const [database, setDatabase] = useState("");
  const [readTable, setReadTable] = useState("");
  const [writeTable, setWriteTable] = useState("");
  const [page, setPage] = useState(["Mysql Input"]);

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
      "http://36.140.31.145:31810/mysql_input/test_connection/",
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setIsConnected(data.status);
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
      "http://36.140.31.145:31810/mysql_input/get_databases/",
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.status === 0) {
          setDatabases(data.databases);
          setPage(page.concat(["Databases"]));
        } else {
          setDatabases([]);
          setTables([]);
        }
      });
    return;
  }

  function handleUseDatabase(e: React.MouseEvent) {
    setDatabases([]);
    setDatabase(e.currentTarget.id);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username,
        password: password,
        host: host,
        database: e.currentTarget.id,
      }),
    };
    console.log(requestOptions);
    fetch("http://36.140.31.145:31810/mysql_input/get_tables/", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.status === 0) {
          setTables(data.tables);
          setPage(page.concat(["Tables"]));
        } else {
          setTables([]);
        }
      });
  }

  function handleUseTable(e: React.MouseEvent) {
    setTables([]);
    setWriteTable("");
    setReadTable(e.currentTarget.id);
    setPage(page.concat(["Configurations"]));
    return;
  }
  function handleSubmit() {
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
    fetch(
      "http://36.140.31.145:31810/mysql_input/data_transfer/",
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
          <h1>Mysql Input</h1>
          <TextField
            id="username"
            label="Username"
            variant="standard"
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
            label="Password"
            variant="standard"
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
            label="Host"
            variant="standard"
            defaultValue={host}
            onChange={(e) => {
              setHost(e.target.value);
              setIsConnected(1);
              setDatabases([]);
              setTables([]);
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
        </>
      ) : null}
      {page.length === 2 && databases.length !== 0 ? (
        <>
          <h2>Databases</h2>
          <ul>
            {databases.map((item, index) => (
              <li key={index}>
                <Button id={item} onClick={handleUseDatabase}>
                  {item}
                </Button>
              </li>
            ))}
          </ul>
        </>
      ) : null}
      {page.length === 3 && tables.length !== 0 ? (
        <>
          <h2>Tables</h2>
          <ul>
            {tables.map((item, index) => (
              <li key={index}>
                <Button id={item} onClick={handleUseTable}>
                  {item}
                </Button>
              </li>
            ))}
          </ul>
        </>
      ) : null}
      {page.length === 4 && readTable !== "" ? (
        <>
          <h2>
            {database}
            {" -> "}
            {readTable}
          </h2>
          <Select
            value={writeTable}
            onChange={(e) => setWriteTable(e.target.value)}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
            size="small"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {writeTables.map((item) => (
              <MenuItem value={item}>{item}</MenuItem>
            ))}
          </Select>
          <br />
          {writeTable !== "" ? (
            <Button onClick={handleSubmit}>Submit</Button>
          ) : null}
        </>
      ) : null}
    </>
  );
}
