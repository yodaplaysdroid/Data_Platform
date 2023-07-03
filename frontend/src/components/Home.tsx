import {
  Box,
  Button,
  Card,
  FormControl,
  InputLabel,
  MenuItem,
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
  Typography,
} from "@mui/material";
import { useState } from "react";

export default function Home() {
  const [res, setRes] = useState<any[]>([]);
  const [status, setStatus] = useState(1);

  let tmp1 = localStorage.getItem("year1");
  let data1 = tmp1 ? tmp1 : "";
  const [year1, setYear1] = useState<any>(data1);
  let tmp2 = localStorage.getItem("year2");
  let data2 = tmp2 ? tmp2 : "";
  const [year2, setYear2] = useState<any>(data2);
  let tmp3 = localStorage.getItem("month1");
  let data3 = tmp3 ? tmp3 : "";
  const [month1, setMonth1] = useState<any>(data3);
  let tmp4 = localStorage.getItem("month2");
  let data4 = tmp4 ? tmp4 : "";
  const [month2, setMonth2] = useState<any>(data4);

  const [years, setYears] = useState<any[]>([]);
  const [months1, setMonths1] = useState<any[]>([]);
  const [months2, setMonths2] = useState<any[]>([]);

  const [harbors, setHarbors] = useState<any[]>([]);
  const [goods, setGoods] = useState<any[]>([]);
  let tmp = localStorage.getItem("an5v");
  let an5v = tmp ? tmp : "";

  if (status === 1) {
    fetch("http://36.140.31.145:31684/dm/refresh/");
    fetch("http://36.140.31.145:31684/dm/?query=select+*+from+记录信息")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setStatus(data.status);
        setRes(data.results);
      });

    fetch(
      "http://36.140.31.145:31684/dm/?query=select+distinct+substring%28操作日期%2C+1%2C+4%29+from+集装箱动态"
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setStatus(data.status);
        setYears(data.results);
      });
    if (year1 !== "") {
      fetch(
        `http://36.140.31.145:31684/dm/?query=select+distinct+substring%28操作日期%2C+6%2C+2%29+from+集装箱动态+where+操作日期+like+%27${year1}%25%27+order+by+substring%28操作日期%2C+6%2C+2%29`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setStatus(data.status);
          setMonths1(data.results);
        });
    }
    if (year2 !== "") {
      fetch(
        `http://36.140.31.145:31684/dm/?query=select+distinct+substring%28操作日期%2C+6%2C+2%29+from+集装箱动态+where+操作日期+like+%27${year2}%25%27+order+by+substring%28操作日期%2C+6%2C+2%29`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setStatus(data.status);
          setMonths2(data.results);
        });
    }
    fetch(
      "http://36.140.31.145:31684/dm/?query=select+distinct+堆存港口+from+分析五"
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("harbors", data);
        setHarbors(data.results);
      });
    fetch(
      "http://36.140.31.145:31684/dm/?query=select+distinct+货物名称+from+分析五"
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("goods", data);
        setGoods(data.results);
      });
  }
  function handleChangeYear(e: SelectChangeEvent<unknown>, id: string) {
    console.log(e.target.value);
    console.log(id);
    fetch(
      `http://36.140.31.145:31684/dm/?query=select+distinct+substring%28操作日期%2C+6%2C+2%29+from+集装箱动态+where+操作日期+like+%27${e.target.value}%25%27+order+by+substring%28操作日期%2C+6%2C+2%29`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setStatus(data.status);
        if (id === "year1") {
          setYear1(e.target.value);
          setMonths1(data.results);
        } else {
          setYear2(e.target.value);
          setMonths2(data.results);
        }
      });
  }
  function handleChangeDate() {
    console.log(year1, year2, month1, month2);
    localStorage.setItem("year1", year1);
    localStorage.setItem("year2", year2);
    localStorage.setItem("month1", month1);
    localStorage.setItem("month2", month2);
    fetch("http://36.140.31.145:31684/dm/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: "drop view 分析3",
      }),
    })
      .then(() =>
        fetch("http://36.140.31.145:31684/dm/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `create view 分析3 as
        select s1.货物名称, sum(s1.总货重) as y1, sum(s2.总货重) as y2, (sum(s2.总货重) - sum(s1.总货重)) as y3 from
        (select * from 分析三 where 年月 like '${year1}-${month1}%') as s1,
        (select * from 分析三 where 年月 like '${year2}-${month2}%') as s2
        where s1.货物名称 = s2.货物名称
        group by s1.货物名称`,
          }),
        })
      )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  }
  function handleChangeGraph(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    type: string[]
  ) {
    localStorage.setItem("an5k", type[0]);
    localStorage.setItem("an5v", e.currentTarget.id);
    const id = e.currentTarget.id;
    fetch("http://36.140.31.145:31684/dm/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: "drop view 分析5",
      }),
    }).then(() => {
      fetch("http://36.140.31.145:31684/dm/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `create view 分析5 as select ${type[1]} as x, 数量吞吐量, 总货重 from 分析五 where ${type[0]} = '${id}'`,
        }),
      });
    });
  }
  const [anchorEl1, setAnchorEl1] = useState<HTMLButtonElement | null>(null);

  const handleClick1 = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl1(event.currentTarget);
  };

  const handleClose1 = () => {
    setAnchorEl1(null);
  };
  const open1 = Boolean(anchorEl1);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

  return (
    <>
      {status === 0 ? (
        <>
          <Box sx={{ p: 2, display: "flex", flexWrap: "wrap" }}>
            <Card
              sx={{
                bgcolor: "background.paper",
                boxShadow: 24,
                borderRadius: 5,
                p: 4,
                margin: 2,
              }}
            >
              <Typography
                variant="button"
                fontSize={18}
                sx={{ marginBottom: 1 }}
              >
                表格记录个数
              </Typography>
              <br />
              <br />
              <TableContainer component={Paper}>
                <Table
                  sx={{ minWidth: 200 }}
                  size="small"
                  aria-label="a dense table"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>表格</TableCell>
                      <TableCell align="right">记录个数</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {res.map((item) => (
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {item[0]}
                        </TableCell>
                        <TableCell align="right">{item[1]}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
            <Card
              sx={{
                bgcolor: "background.paper",
                boxShadow: 24,
                borderRadius: 5,
                p: 4,
                margin: 2,
                height: "fit-content",
              }}
            >
              <Typography
                variant="button"
                fontSize={18}
                sx={{ marginBottom: 1 }}
              >
                港口吞吐量
              </Typography>
              <br />
              <iframe
                style={{ height: 300, width: 600 }}
                src="https://datav.dameng.com/dataview/publish/page.html?pageId=1670041998813306881&isTemplate=0"
                frameBorder={0}
              ></iframe>
            </Card>
            <Card
              sx={{
                bgcolor: "background.paper",
                boxShadow: 24,
                borderRadius: 5,
                p: 4,
                margin: 2,
                height: "fit-content",
              }}
            >
              <Typography
                variant="button"
                fontSize={18}
                sx={{ marginBottom: 1 }}
              >
                货物吞吐量百分比（客户量）
              </Typography>
              <br />
              <iframe
                style={{ height: 300, width: 380 }}
                src="https://datav.dameng.com/dataview/publish/page.html?pageId=1670126477594599425&isTemplate=0"
                frameBorder={0}
              ></iframe>
            </Card>
            <Card
              sx={{
                bgcolor: "background.paper",
                boxShadow: 24,
                borderRadius: 5,
                p: 4,
                margin: 2,
                height: "fit-content",
              }}
            >
              <Typography
                variant="button"
                fontSize={18}
                sx={{ marginBottom: 1 }}
              >
                货物吞吐量百分比（货重）
              </Typography>
              <br />
              <iframe
                style={{ height: 300, width: 480 }}
                src="https://datav.dameng.com/dataview/publish/page.html?pageId=1675858839561314306&isTemplate=0"
                frameBorder={0}
              ></iframe>
            </Card>
            <Card
              sx={{
                bgcolor: "background.paper",
                boxShadow: 24,
                borderRadius: 5,
                p: 4,
                margin: 2,
                height: "fit-content",
              }}
            >
              <Typography
                variant="button"
                fontSize={18}
                sx={{ marginBottom: 1 }}
              >
                港口不同类型货物吞吐量
              </Typography>
              <br />
              <iframe
                style={{ height: 300, width: 800 }}
                src="https://datav.dameng.com/dataview/publish/page.html?pageId=1670113882892410881&isTemplate=0"
                frameBorder={0}
              ></iframe>
            </Card>
            <Card
              sx={{
                bgcolor: "background.paper",
                boxShadow: 24,
                borderRadius: 5,
                p: 4,
                margin: 2,
                height: "fit-content",
              }}
            >
              <Typography
                variant="button"
                fontSize={18}
                sx={{ marginBottom: 1 }}
              >
                货物吞吐同比环比分析
              </Typography>
              <br />
              <iframe
                style={{ height: 300, width: 1000 }}
                src="https://datav.dameng.com/dataview/publish/page.html?pageId=1670457086149926913&isTemplate=0"
                frameBorder={0}
              ></iframe>
            </Card>
            <Card
              sx={{
                bgcolor: "background.paper",
                boxShadow: 24,
                borderRadius: 5,
                p: 4,
                margin: 2,
              }}
            >
              <Typography variant="button" fontSize={15}>
                时间段 1
              </Typography>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 280 }} size="small">
                  <TableBody>
                    <TableRow
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        年份
                      </TableCell>
                      <TableCell align="right">
                        <FormControl sx={{ width: 150 }} size="small">
                          <InputLabel>Year</InputLabel>
                          <Select
                            id="year1"
                            label="Year"
                            defaultValue={year1}
                            onChange={(e) => handleChangeYear(e, "year1")}
                          >
                            {years.length !== 0
                              ? years.map((item) => (
                                  <MenuItem value={item[0]}>{item[0]}</MenuItem>
                                ))
                              : null}
                          </Select>
                        </FormControl>
                      </TableCell>
                    </TableRow>
                    <TableRow
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        月份
                      </TableCell>
                      <TableCell align="right">
                        <FormControl sx={{ width: 150 }} size="small">
                          <InputLabel>Month</InputLabel>
                          <Select
                            id="month1"
                            label="Month"
                            defaultValue={month1}
                            onChange={(e) => setMonth1(e.target.value)}
                          >
                            {months1.length !== 0
                              ? months1.map((item) => (
                                  <MenuItem value={item[0]}>{item[0]}</MenuItem>
                                ))
                              : null}
                          </Select>
                        </FormControl>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <br />
              <Typography variant="button" fontSize={15}>
                时间段 2
              </Typography>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 280 }} size="small">
                  <TableBody>
                    <TableRow
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        年份
                      </TableCell>
                      <TableCell align="right">
                        <FormControl sx={{ width: 150 }} size="small">
                          <InputLabel>Year</InputLabel>
                          <Select
                            id="year2"
                            label="Year"
                            defaultValue={year2}
                            onChange={(e) => handleChangeYear(e, "year2")}
                          >
                            {years.length !== 0
                              ? years.map((item) => (
                                  <MenuItem value={item[0]}>{item[0]}</MenuItem>
                                ))
                              : null}
                          </Select>
                        </FormControl>
                      </TableCell>
                    </TableRow>
                    <TableRow
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        月份
                      </TableCell>
                      <TableCell align="right">
                        <FormControl sx={{ width: 150 }} size="small">
                          <InputLabel>Month</InputLabel>
                          <Select
                            id="month2"
                            label="Month"
                            defaultValue={month2}
                            onChange={(e) => setMonth2(e.target.value)}
                          >
                            {months2.length !== 0
                              ? months2.map((item) => (
                                  <MenuItem value={item[0]}>{item[0]}</MenuItem>
                                ))
                              : null}
                          </Select>
                        </FormControl>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <br />
              {month1 !== undefined &&
              month2 !== undefined &&
              year1 !== undefined &&
              year2 !== undefined ? (
                <Button
                  onClick={handleChangeDate}
                  fullWidth
                  variant="contained"
                >
                  提交
                </Button>
              ) : (
                <Button disabled fullWidth variant="contained">
                  提交
                </Button>
              )}
            </Card>
            <Card
              sx={{
                bgcolor: "background.paper",
                boxShadow: 24,
                borderRadius: 5,
                p: 4,
                margin: 2,
                height: "fit-content",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                  variant="button"
                  fontSize={18}
                  sx={{ marginBottom: 1 }}
                >
                  货物流向分析（{an5v}）
                </Typography>
                <div>
                  <Button
                    sx={{ width: 100 }}
                    color="inherit"
                    onClick={handleClick}
                  >
                    堆存港口
                  </Button>
                  <Popover
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    sx={{ display: "block", justifyContent: "center" }}
                  >
                    {harbors.map((item) => (
                      <>
                        <Button
                          sx={{ width: 150, height: 50 }}
                          id={item[0]}
                          onClick={(e) =>
                            handleChangeGraph(e, ["堆存港口", "货物名称"])
                          }
                        >
                          {item[0]}
                        </Button>
                        <br />
                      </>
                    ))}
                  </Popover>
                  <Button
                    sx={{ width: 100 }}
                    color="inherit"
                    onClick={handleClick1}
                  >
                    货物名称
                  </Button>
                  <Popover
                    open={open1}
                    anchorEl={anchorEl1}
                    onClose={handleClose1}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    sx={{ display: "block", justifyContent: "center" }}
                  >
                    {goods.map((item) => (
                      <>
                        <Button
                          sx={{ width: 150, height: 50 }}
                          id={item[0]}
                          onClick={(e) =>
                            handleChangeGraph(e, ["货物名称", "堆存港口"])
                          }
                        >
                          {item[0]}
                        </Button>
                        <br />
                      </>
                    ))}
                  </Popover>
                </div>
              </div>
              <br />
              <iframe
                style={{ height: 300, width: 1380 }}
                src="https://datav.dameng.com/dataview/publish/page.html?pageId=1670663863973978113&isTemplate=0"
                frameBorder={0}
              ></iframe>
            </Card>
            <Card
              sx={{
                bgcolor: "background.paper",
                boxShadow: 24,
                borderRadius: 5,
                p: 4,
                margin: 2,
                height: "fit-content",
              }}
            >
              <Typography
                variant="button"
                fontSize={18}
                sx={{ marginBottom: 1 }}
              >
                运输时间周期分析
              </Typography>
              <br />
              <iframe
                style={{ height: 200, width: 1380 }}
                src="https://datav.dameng.com/dataview/publish/page.html?pageId=1670137009093484545&isTemplate=0"
                frameBorder={0}
              ></iframe>
            </Card>
          </Box>
        </>
      ) : null}
    </>
  );
}
