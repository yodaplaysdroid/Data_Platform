import {
  Box,
  Paper,
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
  if (status === 1) {
    fetch("http://36.140.31.145:31684/dm/refresh/");
    fetch("http://36.140.31.145:31684/dm/?query=select+*+from+记录信息")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setStatus(data.status);
        setRes(data.results);
      });
  }
  return (
    <>
      {status === 0 ? (
        <>
          <Box sx={{ p: 4, display: "flex" }}>
            <Box
              sx={{
                bgcolor: "background.paper",
                boxShadow: 24,
                borderRadius: 5,
                p: 4,
              }}
            >
              <Typography
                variant="button"
                fontSize={18}
                sx={{ marginBottom: 1 }}
              >
                表格记录个数
              </Typography>
              <TableContainer component={Paper}>
                <Table
                  sx={{ width: 200 }}
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
            </Box>
          </Box>
        </>
      ) : null}
    </>
  );
}
