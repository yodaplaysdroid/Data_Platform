import {
  Box,
  Button,
  Card,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  MenuList,
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
import { useEffect, useState } from "react";
import { Chart as ChartJS, registerables } from "chart.js";
import { Line, Bar, Pie, Doughnut, Chart } from "react-chartjs-2";

ChartJS.register(...registerables);

export default function Home() {
  const [seconds, setSeconds] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  const [res, setRes] = useState<any[]>([]);
  const [status, setStatus] = useState(1);

  const [year1, setYear1] = useState<any>("");
  const [year2, setYear2] = useState<any>("");
  const [month1, setMonth1] = useState<any>("");
  const [month2, setMonth2] = useState<any>("");

  const [years, setYears] = useState<any[]>([]);
  const [months1, setMonths1] = useState<any[]>([]);
  const [months2, setMonths2] = useState<any[]>([]);

  const [harbors, setHarbors] = useState<any[]>([]);
  const [goods, setGoods] = useState<any[]>([]);

  const [ann3, setAnn3] = useState<any[]>([]);
  const [ann4, setAnn4] = useState<any[]>([]);
  const [ann5, setAnn5] = useState<any[]>([]);
  const [ann6, setAnn6] = useState<any[]>([]);
  const [res1, setRes1] = useState<any[]>([]);
  const [res2, setRes2] = useState<any[]>([]);
  const [res3, setRes3] = useState<any[]>([]);
  const [res4, setRes4] = useState<any[]>([]);
  const [res5, setRes5] = useState<any[]>([]);
  const [res6, setRes6] = useState<any[]>([]);
  const [an3v, setAn3v] = useState("");
  const [an5v, setAn5v] = useState("");

  if (status === 1) {
    fetch("http://36.140.31.145:31684/dm/refresh/");
    fetch("http://36.140.31.145:31684/dm/?query=select+*+from+记录信息")
      .then((response) => response.json())
      .then((data) => {
        setStatus(data.status);
        setRes(data.results);
      });

    fetch(
      "http://36.140.31.145:31684/dm/?query=select+v+from+ops+where+k+%3D+%27ann3%27"
    )
      .then((response) => response.json())
      .then((data) => {
        setStatus(data.status);
        setAn3v(data.results);
      });

    fetch(
      "http://36.140.31.145:31684/dm/?query=select+v+from+ops+where+k+%3D+%27ann5%27"
    )
      .then((response) => response.json())
      .then((data) => {
        setStatus(data.status);
        setAn5v(data.results);
      });

    fetch(
      "http://36.140.31.145:31684/dm/?query=select+distinct+substring%28操作日期%2C+1%2C+4%29+from+集装箱动态"
    )
      .then((response) => response.json())
      .then((data) => {
        setStatus(data.status);
        setYears(data.results);
      });
    if (year1 !== "") {
      fetch(
        `http://36.140.31.145:31684/dm/?query=select+distinct+substring%28操作日期%2C+6%2C+2%29+from+集装箱动态+where+操作日期+like+%27${year1}%25%27+order+by+substring%28操作日期%2C+6%2C+2%29`
      )
        .then((response) => response.json())
        .then((data) => {
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
          setStatus(data.status);
          setMonths2(data.results);
        });
    }
    fetch(
      "http://36.140.31.145:31684/dm/?query=select+distinct+堆存港口+from+分析五"
    )
      .then((response) => response.json())
      .then((data) => {
        setHarbors(data.results);
      });
    fetch(
      "http://36.140.31.145:31684/dm/?query=select+distinct+货物名称+from+分析五"
    )
      .then((response) => response.json())
      .then((data) => {
        setGoods(data.results);
      });
    fetch(
      "http://36.140.31.145:31684/dm/?query=select%20substring%28%E7%9C%81%E5%B8%82%E5%8C%BA%2C%201%2C%202%29%2C%20count%28%E6%8F%90%E5%8D%95%E5%8F%B7%29%2C%20sum%28%E8%B4%A7%E9%87%8D_%E5%90%A8%29%0Afrom%20%E5%AE%A2%E6%88%B7%E4%BF%A1%E6%81%AF%2C%20%E7%89%A9%E6%B5%81%E4%BF%A1%E6%81%AF%0Awhere%20%E8%B4%A7%E4%B8%BB%E4%BB%A3%E7%A0%81%3D%E5%AE%A2%E6%88%B7%E7%BC%96%E5%8F%B7%0Agroup%20by%20substring%28%E7%9C%81%E5%B8%82%E5%8C%BA%2C%201%2C%202%29%0Aorder%20by%20count%28%E6%8F%90%E5%8D%95%E5%8F%B7%29%20desc%0Alimit%205%3B"
    )
      .then((response) => response.json())
      .then((data) => {
        setAnn3(data.results);
      });
    fetch(
      "http://36.140.31.145:31684/dm/?query=select%20%E5%A0%86%E5%AD%98%E6%B8%AF%E5%8F%A3%2C%20count%28%E6%8F%90%E5%8D%95%E5%8F%B7%29%0Afrom%20%E9%9B%86%E8%A3%85%E7%AE%B1%E5%8A%A8%E6%80%81%0Awhere%20%E6%93%8D%E4%BD%9C%3D%27%E5%85%A5%E5%BA%93%27%0Agroup%20by%20%E5%A0%86%E5%AD%98%E6%B8%AF%E5%8F%A3%0Aorder%20by%20count%28%E6%8F%90%E5%8D%95%E5%8F%B7%29%20desc%0Alimit%205%3B"
    )
      .then((response) => response.json())
      .then((data) => {
        setAnn4(data.results);
      });
    fetch(
      "http://36.140.31.145:31684/dm/?query=select%20%E5%A0%86%E5%AD%98%E6%B8%AF%E5%8F%A3%2C%20count%28%E6%8F%90%E5%8D%95%E5%8F%B7%29%0Afrom%20%E9%9B%86%E8%A3%85%E7%AE%B1%E5%8A%A8%E6%80%81%0Awhere%20%E6%93%8D%E4%BD%9C%3D%27%E5%87%BA%E5%BA%93%27%0Agroup%20by%20%E5%A0%86%E5%AD%98%E6%B8%AF%E5%8F%A3%0Aorder%20by%20count%28%E6%8F%90%E5%8D%95%E5%8F%B7%29%20desc%0Alimit%205%3B"
    )
      .then((response) => response.json())
      .then((data) => {
        setAnn5(data.results);
      });
    fetch(
      "http://36.140.31.145:31684/dm/?query=select%20substring%28%E8%A3%85%E8%B4%A7%E8%A1%A8.%E4%BD%9C%E4%B8%9A%E5%BC%80%E5%A7%8B%E6%97%B6%E9%97%B4%2C%201%2C%207%29%2C%20avg%28datediff%28day%2C%20%E8%A3%85%E8%B4%A7%E8%A1%A8.%E4%BD%9C%E4%B8%9A%E5%BC%80%E5%A7%8B%E6%97%B6%E9%97%B4%2C%20%E5%8D%B8%E8%B4%A7%E8%A1%A8.%E4%BD%9C%E4%B8%9A%E7%BB%93%E6%9D%9F%E6%97%B6%E9%97%B4%29%29%20as%20%E6%97%B6%E9%97%B4%0Afrom%20%E8%A3%85%E8%B4%A7%E8%A1%A8%2C%20%E5%8D%B8%E8%B4%A7%E8%A1%A8%0Awhere%20%E8%A3%85%E8%B4%A7%E8%A1%A8.%E6%8F%90%E5%8D%95%E5%8F%B7%20%3D%20%E5%8D%B8%E8%B4%A7%E8%A1%A8.%E6%8F%90%E5%8D%95%E5%8F%B7%0Agroup%20by%20substring%28%E8%A3%85%E8%B4%A7%E8%A1%A8.%E4%BD%9C%E4%B8%9A%E5%BC%80%E5%A7%8B%E6%97%B6%E9%97%B4%2C%201%2C%207%29%0Aorder%20by%20substring%28%E8%A3%85%E8%B4%A7%E8%A1%A8.%E4%BD%9C%E4%B8%9A%E5%BC%80%E5%A7%8B%E6%97%B6%E9%97%B4%2C%201%2C%207%29"
    )
      .then((response) => response.json())
      .then((data) => {
        let t: any[] = [[], []];
        for (let i in data.results) {
          t[0].push(data.results[i][0]);
          t[1].push(data.results[i][1]);
        }
        setAnn6(t);
      });
    fetch("http://36.140.31.145:31684/dm/?query=select+*+from+分析一")
      .then((response) => response.json())
      .then((data) => {
        setStatus(data.status);
        let tmp: any = [[], [], []];
        for (let i in data.results) {
          tmp[0].push(data.results[i][0]);
          tmp[1].push(data.results[i][1]);
          tmp[2].push(data.results[i][2]);
        }
        setRes1(tmp);
      });
    fetch("http://36.140.31.145:31684/dm/?query=select+*+from+分析二")
      .then((response) => response.json())
      .then((data) => {
        setStatus(data.status);
        let tmp: any = [[], [], []];
        for (let i in data.results) {
          tmp[0].push(data.results[i][0]);
          tmp[1].push(data.results[i][1]);
          tmp[2].push(data.results[i][2]);
        }
        setRes2(tmp);
      });
    fetch(
      `http://36.140.31.145:31684/dm/?query=${encodeURIComponent(
        "select v from ops where k = 'ann3'"
      )}`
    )
      .then((response) => response.json())
      .then((data) => {
        let [d1, d2] = data.results[0][0].split(" ~ ");
        const query = `select s1.货物名称, sum(s1.总货重) as y1, sum(s2.总货重) as y2, (sum(s2.总货重) - sum(s1.总货重))*100/sum(s1.总货重) as y3 from
          (select * from 分析三 where 年月 like '%${d1}%') as s1,
          (select * from 分析三 where 年月 like '%${d2}%') as s2
          where s1.货物名称 = s2.货物名称
          group by s1.货物名称
          order by y3 desc;`;

        fetch(
          `http://36.140.31.145:31684/dm/?query=${encodeURIComponent(query)}`
        )
          .then((response) => response.json())
          .then((data) => {
            setStatus(data.status);
            let tmp: any = [[], [], [], []];
            for (let i in data.results) {
              tmp[0].push(data.results[i][0]);
              tmp[1].push(data.results[i][1]);
              tmp[2].push(data.results[i][2]);
              tmp[3].push(data.results[i][3]);
            }
            setRes3(tmp);
          });
      });
    fetch("http://36.140.31.145:31684/dm/?query=select+*+from+分析四")
      .then((response) => response.json())
      .then((data) => {
        setStatus(data.status);
        let tmp: any = [[], [], []];
        for (let i in data.results) {
          tmp[0].push(data.results[i][0]);
          tmp[1].push(data.results[i][1]);
          tmp[2].push(data.results[i][2]);
        }
        setRes4(tmp);
      });
    fetch(
      `http://36.140.31.145:31684/dm/?query=${encodeURIComponent(
        "select v from ops where k = 'ann5'"
      )}`
    )
      .then((response) => response.json())
      .then((data) => {
        let [type, id] = data.results[0][0].split(": ");
        let query = "";
        if (type == "货物名称") {
          query = `select 堆存港口 as x, 数量吞吐量, 总货重 from 分析五 where 货物名称 = '${id}'`;
        } else {
          query = `select 货物名称 as x, 数量吞吐量, 总货重 from 分析五 where 堆存港口 = '${id}'`;
        }
        fetch(
          `http://36.140.31.145:31684/dm/?query=${encodeURIComponent(query)}`
        )
          .then((response) => response.json())
          .then((data) => {
            setStatus(data.status);
            let tmp: any = [[], [], []];
            for (let i in data.results) {
              tmp[0].push(data.results[i][0]);
              tmp[1].push(data.results[i][1]);
              tmp[2].push(data.results[i][2]);
            }
            setRes5(tmp);
          });
      });
    fetch(
      "http://36.140.31.145:31684/dm/?query=select+*+from+分析六+order+by+时间消耗_日"
    )
      .then((response) => response.json())
      .then((data) => {
        setStatus(data.status);
        let tmp: any = [[], [], []];
        for (let i in data.results) {
          tmp[0].push(data.results[i][0]);
          tmp[1].push(data.results[i][1]);
          tmp[2].push(data.results[i][3]);
        }
        setRes6(tmp);
      });
  }
  function handleChangeYear(e: SelectChangeEvent<unknown>, id: string) {
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
    const query = `
        select s1.货物名称, sum(s1.总货重) as y1, sum(s2.总货重) as y2, (sum(s2.总货重) - sum(s1.总货重))*100/sum(s1.总货重) as y3 from
        (select * from 分析三 where 年月 like '${year1}-${month1}%') as s1,
        (select * from 分析三 where 年月 like '${year2}-${month2}%') as s2
        where s1.货物名称 = s2.货物名称
        group by s1.货物名称
        order by y3 desc`;
    fetch(`http://36.140.31.145:31684/dm/?query=${encodeURIComponent(query)}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        let tmp: any = [[], [], [], []];
        for (let i in data.results) {
          tmp[0].push(data.results[i][0]);
          tmp[1].push(data.results[i][1]);
          tmp[2].push(data.results[i][2]);
          tmp[3].push(data.results[i][3]);
        }
        setRes3(tmp);
        setAn3v(`${year1}-${month1} ~ ${year2}-${month2}`);
      });
    fetch("http://36.140.31.145:31684/dm/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `update ops set v = '${year1}-${month1} ~ ${year2}-${month2}' where k = 'ann3'`,
      }),
    });
  }
  function handleChangeGraph(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    type: string[]
  ) {
    handleClose();
    handleClose1();
    const id = e.currentTarget.id;
    const query = `select ${type[1]} as x, 数量吞吐量, 总货重 from 分析五 where ${type[0]} = '${id}'`;
    setAn5v(`${type[0]}: ${id}`);
    fetch("http://36.140.31.145:31684/dm/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `update ops set v = '${type[0]}: ${id}' where k = 'ann5'`,
      }),
    });
    fetch(`http://36.140.31.145:31684/dm/?query=${encodeURIComponent(query)}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        let tmp: any = [[], [], []];
        for (let i in data.results) {
          tmp[0].push(data.results[i][0]);
          tmp[1].push(data.results[i][1]);
          tmp[2].push(data.results[i][2]);
        }
        console.log(data);
        setRes5(tmp);
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
                height: 350,
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
                height: 350,
                width: 600,
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
              <Chart
                type="bar"
                style={{ marginLeft: 10 }}
                data={{
                  labels: res1[0],
                  datasets: [
                    {
                      label: "吞吐量",
                      data: res1[1],
                      type: "bar",
                      backgroundColor: "rgba(75, 192, 192, 0.6)",
                      borderColor: "rgba(75, 192, 192, 1)",
                      borderWidth: 1,
                      yAxisID: "y1",
                    },
                    {
                      label: "总货重",
                      data: res1[2],
                      type: "line",
                      borderColor: "rgba(255, 99, 132, 1)",
                      borderWidth: 2,
                      fill: false,
                      yAxisID: "y2",
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  scales: {
                    y1: {
                      beginAtZero: true,
                      position: "left",
                    },
                    y2: {
                      beginAtZero: true,
                      position: "right",
                      grid: {
                        drawOnChartArea: false,
                      },
                    },
                  },
                }}
              />
            </Card>
            <Card
              sx={{
                bgcolor: "background.paper",
                boxShadow: 24,
                borderRadius: 5,
                p: 4,
                margin: 2,
                height: 350,
                width: 380,
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
              <Doughnut
                style={{ marginLeft: 10 }}
                data={{
                  labels: res4[0],
                  datasets: [
                    {
                      data: res4[1],
                      borderWidth: 1,
                      backgroundColor: [
                        "#addcc9",
                        "#dbebc2",
                        "#fdd2b5",
                        "#f7a8a6",
                        "#f48b94",
                      ],
                    },
                  ],
                }}
                options={{
                  aspectRatio: 1.2,
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "right",
                      align: "start",
                      labels: {
                        boxWidth: 20,
                      },
                    },
                  },
                }}
              />
            </Card>
            <Card
              sx={{
                bgcolor: "background.paper",
                boxShadow: 24,
                borderRadius: 5,
                p: 4,
                margin: 2,
                height: 350,
                width: 380,
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
              <Pie
                style={{ marginLeft: 10 }}
                data={{
                  labels: res4[0],
                  datasets: [
                    {
                      data: res4[2],
                      borderWidth: 1,
                      backgroundColor: [
                        "#475c6c",
                        "#8a8583",
                        "#eed7a1",
                        "#f7efd2",
                        "#cd8b62",
                      ],
                    },
                  ],
                }}
                options={{
                  aspectRatio: 1.2,
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "right",
                      align: "start",
                      labels: {
                        boxWidth: 20,
                      },
                    },
                  },
                }}
              />
            </Card>
            <Card
              sx={{
                bgcolor: "background.paper",
                boxShadow: 24,
                borderRadius: 5,
                p: 4,
                margin: 2,
                height: 350,
                width: 900,
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
              <Chart
                type="bar"
                style={{ marginLeft: 10 }}
                data={{
                  labels: res2[0],
                  datasets: [
                    {
                      label: "客户量",
                      data: res2[1],
                      backgroundColor: "rgba(255, 51, 153, 0.6)",
                      borderColor: "rgba(255, 51, 153, 1)",
                      borderWidth: 1,
                      yAxisID: "y1",
                    },
                    {
                      label: "总货重",
                      data: res2[2],
                      type: "line",
                      borderColor: "rgba(204, 0, 204, 1)",
                      borderWidth: 2,
                      fill: false,
                      yAxisID: "y2",
                    },
                  ],
                }}
                options={{
                  aspectRatio: 2.8,
                  responsive: true,
                  scales: {
                    y1: {
                      beginAtZero: true,
                      position: "left",
                    },
                    y2: {
                      beginAtZero: true,
                      position: "right",
                      grid: {
                        drawOnChartArea: false,
                      },
                    },
                  },
                }}
              />
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
              <Typography
                variant="button"
                fontSize={18}
                sx={{ marginBottom: 1 }}
              >
                各港口地理分布
              </Typography>
              <br />
              <iframe
                style={{ height: 500, width: 1380 }}
                src="/map/"
                scrolling="no"
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
                height: 450,
                width: 1000,
              }}
            >
              <Typography
                variant="button"
                fontSize={18}
                sx={{ marginBottom: 1 }}
              >
                货物吞吐同比环比分析（{an3v}）
              </Typography>
              <br />
              <Line
                style={{ marginLeft: 10 }}
                data={{
                  labels: res3[0],
                  datasets: [
                    {
                      label: "时间段1",
                      data: res3[1],
                      backgroundColor: "rgba(51, 153, 255, 0.2)",
                      borderColor: "rgba(51, 153, 255, 1)",
                      borderWidth: 1,
                      fill: "origin",
                    },
                    {
                      label: "时间段2",
                      data: res3[2],
                      backgroundColor: "rgba(255, 153, 51, 0.2)",
                      borderColor: "rgba(255, 153, 51, 1)",
                      borderWidth: 1,
                      fill: "origin",
                    },
                  ],
                }}
                options={{
                  aspectRatio: 5,
                  responsive: true,
                  scales: {
                    x: {
                      grid: {
                        display: false,
                      },
                    },
                    y: {
                      beginAtZero: true,
                    },
                  },
                  plugins: {
                    legend: {
                      position: "right",
                    },
                  },
                }}
              />
              <br />
              <Bar
                style={{ marginLeft: 10 }}
                data={{
                  labels: res2[0],
                  datasets: [
                    {
                      label: "增长（%）",
                      data: res3[3],
                      backgroundColor: "rgba(51, 255, 153, 0.6)",
                      borderColor: "rgba(51, 255, 153, 1)",
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  aspectRatio: 5,
                  responsive: true,
                  scales: {
                    x: {
                      grid: {
                        display: false,
                      },
                    },
                    y: {
                      beginAtZero: true,
                    },
                  },
                  plugins: {
                    legend: {
                      position: "right",
                    },
                  },
                }}
              />
            </Card>
            <Card
              sx={{
                bgcolor: "background.paper",
                boxShadow: 24,
                borderRadius: 5,
                p: 4,
                margin: 2,
                height: 450,
              }}
            >
              <Typography variant="button" fontSize={15}>
                时间段 1
              </Typography>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 280 }}>
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
                <Table sx={{ minWidth: 280 }}>
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
              year2 !== undefined &&
              seconds <= 0 ? (
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
                width: 1380,
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
                  {seconds <= 0 ? (
                    <Button
                      sx={{ width: 100 }}
                      color="inherit"
                      onClick={handleClick}
                    >
                      堆存港口
                    </Button>
                  ) : (
                    <Button sx={{ width: 100 }} color="inherit">
                      堆存港口
                    </Button>
                  )}
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
                  {seconds <= 0 ? (
                    <Button
                      sx={{ width: 100 }}
                      color="inherit"
                      onClick={handleClick1}
                    >
                      货物名称
                    </Button>
                  ) : (
                    <Button sx={{ width: 100 }} color="inherit">
                      货物名称
                    </Button>
                  )}
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
              <Chart
                type="bar"
                style={{ marginLeft: 10 }}
                data={{
                  labels: res5[0],
                  datasets: [
                    {
                      label: "货物吞吐量",
                      data: res5[1],
                      backgroundColor: "rgba(153, 51, 255, 0.6)",
                      borderColor: "rgba(153, 51, 255, 1)",
                      borderWidth: 1,
                      yAxisID: "y1",
                    },
                    {
                      label: "总货重",
                      data: res5[2],
                      type: "line",
                      borderColor: "rgba(204, 204, 0, 1)",
                      borderWidth: 2,
                      fill: false,
                      yAxisID: "y2",
                    },
                  ],
                }}
                options={{
                  aspectRatio: 4,
                  responsive: true,
                  scales: {
                    y1: {
                      beginAtZero: true,
                      position: "left",
                    },
                    y2: {
                      beginAtZero: true,
                      position: "right",
                      grid: {
                        drawOnChartArea: false,
                      },
                    },
                  },
                }}
              />
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
                省份货物消费排行
              </Typography>
              <br />
              {
                <MenuList sx={{ width: 480 }}>
                  {ann3.map((item) => (
                    <MenuItem>
                      <ListItemText>{item[0]}</ListItemText>
                      <Typography variant="body2" color="text.secondary">
                        {item[1]}
                        {" 单"} / {item[2]}
                        {" 吨"}
                      </Typography>
                    </MenuItem>
                  ))}
                </MenuList>
              }
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
                入库堆存港口排行
              </Typography>
              <br />
              {
                <MenuList sx={{ width: 350 }}>
                  {ann4.map((item) => (
                    <MenuItem>
                      <ListItemText>{item[0]}</ListItemText>
                      <Typography variant="body2" color="text.secondary">
                        {item[1]}
                        {" 次"}
                      </Typography>
                    </MenuItem>
                  ))}
                </MenuList>
              }
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
                出库堆存港口排行
              </Typography>
              <br />
              {
                <MenuList sx={{ width: 350 }}>
                  {ann5.map((item) => (
                    <MenuItem>
                      <ListItemText>{item[0]}</ListItemText>
                      <Typography variant="body2" color="text.secondary">
                        {item[1]}
                        {" 次"}
                      </Typography>
                    </MenuItem>
                  ))}
                </MenuList>
              }
            </Card>
            <Card
              sx={{
                bgcolor: "background.paper",
                boxShadow: 24,
                borderRadius: 5,
                p: 4,
                margin: 2,
                width: 600,
              }}
            >
              <Typography
                variant="button"
                fontSize={18}
                sx={{ marginBottom: 1 }}
              >
                货物传送时间周期趋势
              </Typography>
              <br />
              <Line
                style={{ marginLeft: 10 }}
                data={{
                  labels: ann6[0],
                  datasets: [
                    {
                      label: "时间周期（日）",
                      data: ann6[1],
                      fill: false,
                      borderColor: "#711490",
                    },
                  ],
                }}
              />
            </Card>
            <Card
              sx={{
                bgcolor: "background.paper",
                boxShadow: 24,
                borderRadius: 5,
                p: 4,
                margin: 2,
                height: 350,
                width: 680,
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
              <Line
                style={{ marginLeft: 10 }}
                data={{
                  labels: res6[0],
                  datasets: [
                    {
                      label: "日",
                      data: res6[1],
                      borderColor: "rgba(255, 51, 255, 1)",
                      borderWidth: 2,
                      fill: false,
                      yAxisID: "y1",
                    },
                    {
                      label: "流转周期",
                      data: res6[2],
                      borderColor: "rgba(51, 255, 153, 1)",
                      borderWidth: 2,
                      fill: false,
                      yAxisID: "y2",
                    },
                  ],
                }}
                options={{
                  aspectRatio: 2,
                  responsive: true,
                  scales: {
                    y1: {
                      position: "left",
                    },
                    y2: {
                      position: "right",
                      grid: {
                        drawOnChartArea: false,
                      },
                    },
                  },
                }}
              />
            </Card>
          </Box>
        </>
      ) : null}
    </>
  );
}
