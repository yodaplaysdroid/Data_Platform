import {
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Typography,
  Button,
  Box,
  Modal,
} from "@mui/material";
import { useState } from "react";

interface EditProps {
  tableName: string;
  itemId: number;
}

export default function Edit(props: EditProps) {
  const { tableName, itemId } = props;
  const [status, setStatus] = useState(1);
  const [columns, setColumns] = useState<string[]>([]);
  const [record, setRecord] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  function getData(tb: string, id: number) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tablename: tb,
        startpoint: id,
        records: 1,
      }),
    };
    console.log(requestOptions);
    fetch("http://36.140.31.145:31684/error_handler/get_tmp/", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setColumns(data.columns);
        setRecord(data.errors[0]);
        setStatus(2);
      });
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    let tmp = record;
    tmp[Number(e.target.id)] = e.target.value;
    setRecord(tmp);
  }
  function handleSubmit() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tablename: tableName,
        itemtofix: [itemId, record.slice(0, -2)],
      }),
    };
    console.log(requestOptions);
    fetch("http://36.140.31.145:31684/error_handler/fix_error/", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        data.status === -2 ? setError(data.errors) : null;
        setStatus(data.status);
        setOpen(true);
      });
  }
  status === 1 ? getData(tableName, itemId) : null;
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          align="left"
          sx={{ marginTop: 1, marginBottom: 1 }}
        >
          修改记录
        </Typography>
        <Button onClick={handleSubmit}>提交</Button>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 400 }} aria-label="simple table">
          <TableBody>
            {columns.map((item, index) => (
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {item}
                </TableCell>
                <TableCell align="right">
                  <TextField
                    id={index.toString()}
                    variant="outlined"
                    fullWidth
                    defaultValue={record[index]}
                    onChange={handleChange}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            height: 100,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          {status === 0 ? (
            <>
              修改成功
              <br />
              <div
                style={{
                  justifyContent: "flex-end",
                  display: "flex",
                  width: "100%",
                  paddingTop: 50,
                }}
              >
                <Button onClick={() => window.location.reload()}>OK</Button>
              </div>
            </>
          ) : null}
          {status === -1 ? (
            <>
              服务器异常
              <br />
              <div
                style={{
                  justifyContent: "flex-end",
                  display: "flex",
                  width: "100%",
                  paddingTop: 50,
                }}
              >
                <Button onClick={() => window.location.reload()}>OK</Button>
              </div>
            </>
          ) : null}
          {status === -2 ? (
            <>
              {error}
              <br />
              <div
                style={{
                  justifyContent: "flex-end",
                  display: "flex",
                  width: "100%",
                  paddingTop: 50,
                }}
              >
                <Button onClick={() => setOpen(false)}>继续修高</Button>
                <Button onClick={() => window.location.reload()}>放弃</Button>
              </div>
            </>
          ) : null}
        </Box>
      </Modal>
    </>
  );
}
