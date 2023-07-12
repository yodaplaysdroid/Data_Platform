import { Button, LinearProgress, Typography } from "@mui/material";
import { useState } from "react";

interface props {
  tableName: string;
}

export default function Shortcut(props: props) {
  const { tableName } = props;
  const [loading, setLoading] = useState(
    <LinearProgress variant="determinate" value={0} />
  );
  function handleDelete() {
    setLoading(<LinearProgress />);
    fetch("http://36.140.31.145:31684/dm/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `delete from ${tableName}tmp`,
      }),
    })
      .then(() =>
        setLoading(<LinearProgress variant="determinate" value={100} />)
      )
      .then(() => window.location.reload());
  }
  function handleUnique() {
    setLoading(<LinearProgress />);
    fetch("http://36.140.31.145:31684/dm/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `delete from ${tableName}tmp where 错误类型 like '[CODE:-6602]%'`,
      }),
    })
      .then(() =>
        setLoading(<LinearProgress variant="determinate" value={100} />)
      )
      .then(() => window.location.reload());
  }
  return (
    <>
      <Typography variant="h6" sx={{ marginTop: 1, marginBottom: 1 }}>
        一键修改
      </Typography>
      {loading}
      <Button
        fullWidth
        sx={{ marginTop: 1, marginBottom: 1, fontSize: 18 }}
        onClick={handleUnique}
      >
        一键去重
      </Button>
      <Button
        fullWidth
        sx={{ marginTop: 1, marginBottom: 1, fontSize: 18 }}
        onClick={handleDelete}
      >
        一键清除
      </Button>
    </>
  );
}
