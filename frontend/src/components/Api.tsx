import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Popover,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import React from "react";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import saveAs from "file-saver";

export default function Api() {
  const [query, setQuery] = useState("");
  const [table, setTable] = useState("");
  const [cols, setCols] = useState<any[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [order, setOrder] = useState("");
  const [asc, setAsc] = useState(true);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any>([]);
  const [status, setStatus] = useState(1);

  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

  const [content, setContent] = useState(<></>);

  const [openModal, setOpenModal] = useState(false);
  function handleOpenModal() {
    setContent(
      <>
        <Typography align="center">
          正在处理中。。。
          <br />
          <br />
          <CircularProgress />
        </Typography>
      </>
    );
    setOpenModal(true);
    fetch("http://36.140.31.145:31684/api/download/?mode=generate")
      .then((response) => response.json())
      .then((data) => console.log(data))
      .then(() =>
        setContent(
          <Button fullWidth onClick={handleDownload}>
            下载文件
          </Button>
        )
      );
  }
  const handleCloseModal = () => setOpenModal(false);

  function handleChangeTable(e: SelectChangeEvent<string>) {
    setTable(e.target.value);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tablename: e.target.value,
        startpoint: 1,
        records: 1,
      }),
    };
    console.log(requestOptions);
    fetch("http://36.140.31.145:31684/error_handler/get_tmp/", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setColumns(data.columns);
      });
  }
  function handleChangeOrder(e: SelectChangeEvent<string>) {
    setOrder(e.target.value);
  }
  function handleSubmit() {
    let sql = "";
    if (query == "") {
      if (table != "") {
        sql += `SELECT * FROM ${table}`;
        if (search != "") {
          sql += " WHERE";
          for (let i in columns) {
            i != "0" ? (sql += " OR") : null;
            sql += ` ${columns[i]} LIKE '%${search}%'`;
          }
        }
        if (order != "") {
          sql += ` ORDER BY ${order}`;
          if (asc == true) {
            sql += " ASC";
          } else {
            sql += " DESC";
          }
        }
        sql += " LIMIT 100";
        setCols(columns);
      }
    } else {
      setCols([]);
      console.log(query);
      sql = query;
    }
    console.log(sql);
    console.log(
      `http://36.140.31.145:31684/dm/?query=${encodeURIComponent(sql)}`
    );

    fetch(`http://36.140.31.145:31684/dm/?query=${encodeURIComponent(sql)}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setResults(data.results);
        setStatus(data.status);
      });
  }

  function handleDownload() {
    fetch("http://36.140.31.145:31684/api/download/?mode=download")
      .then((response) => response.blob())
      .then((blob) => {
        saveAs(blob, "download.xlsx");
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <>
      <Box
        sx={{
          p: 2,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Card
          sx={{
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 5,
            p: 4,
            margin: 2,
            width: "100%",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="button" fontSize={20} fontWeight={1000}>
              数据查询
              <Tooltip title="Help" onClick={handleClick}>
                <IconButton>
                  <HelpOutlineRoundedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                <Typography sx={{ p: 2 }}>
                  主机地址: 36.140.31.145:31826
                  <br />
                  用户名: dbuser
                  <br />
                  用户密码: dbuser123
                  <br />
                  API 访问地址: http://36.140.31.145:31684/api/?query=
                  <br />
                  *使用 API 地址时，在 query 后面加上 uri 格式的 sql 语句即可*
                </Typography>
              </Popover>
              <Tooltip title="Export" onClick={handleOpenModal}>
                <IconButton>
                  <DownloadRoundedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Typography>
            <Button
              variant="outlined"
              sx={{ width: 150 }}
              onClick={handleSubmit}
            >
              查询
            </Button>
          </div>
          <br />
          <br />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="button" fontSize={18} sx={{ marginBottom: 1 }}>
              表格:{"\t"}
              <FormControl size="small" sx={{ width: 150 }}>
                <InputLabel>Table</InputLabel>
                <Select label="Table" onChange={handleChangeTable}>
                  <MenuItem value={"物流公司"}>物流公司</MenuItem>
                  <MenuItem value={"客户信息"}>客户信息</MenuItem>
                  <MenuItem value={"物流信息"}>物流信息</MenuItem>
                  <MenuItem value={"集装箱动态"}>集装箱动态</MenuItem>
                  <MenuItem value={"装货表"}>装货表</MenuItem>
                  <MenuItem value={"卸货表"}>卸货表</MenuItem>
                </Select>
              </FormControl>
            </Typography>
            <Typography variant="button" fontSize={18} sx={{ marginBottom: 1 }}>
              排序:{"\t"}
              <FormControl size="small" sx={{ width: 150 }}>
                <InputLabel>Column</InputLabel>
                <Select label="Column" onChange={handleChangeOrder}>
                  {columns.map((item) => (
                    <MenuItem value={item}>{item}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Typography>
            <Typography variant="button" fontSize={18} sx={{ marginBottom: 1 }}>
              升序 / 降序:{"\t"}
              <FormControl size="small" sx={{ width: 100 }}>
                <InputLabel>Order</InputLabel>
                <Select
                  label="Order"
                  defaultValue={1}
                  onChange={(e) => {
                    e.target.value == 1 ? setAsc(true) : setAsc(false);
                  }}
                >
                  <MenuItem value={1}>升序</MenuItem>
                  <MenuItem value={0}>降序</MenuItem>
                </Select>
              </FormControl>
            </Typography>
            <Typography variant="button" fontSize={18} sx={{ marginBottom: 1 }}>
              搜索:{"\t"}
              <TextField
                size="small"
                label="Search"
                variant="outlined"
                sx={{ width: 200 }}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
            </Typography>
          </div>
          <br />
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="button" fontSize={18}>
                自行输入 sql 语句
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TextField
                label="此处输入 SQL 查询语句"
                fullWidth
                variant="outlined"
                onChange={(e) => {
                  setQuery(e.target.value);
                }}
              />
            </AccordionDetails>
          </Accordion>
        </Card>
        <Card
          sx={{
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 5,
            p: 4,
            margin: 2,
            width: "100%",
          }}
        >
          <Typography variant="button" fontSize={18} sx={{ marginBottom: 1 }}>
            结果
          </Typography>
          {status == 0 ? (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} size="small">
                <TableHead>
                  <TableRow>
                    {cols.map((item) => (
                      <TableCell align="right">{item}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {results.map((row: any[]) => (
                    <TableRow
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      {row.map((item) => (
                        <TableCell align="right">{item}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : null}
        </Card>
      </Box>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            height: 80,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          {content}
        </Box>
      </Modal>
    </>
  );
}
