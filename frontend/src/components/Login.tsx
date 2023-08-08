import { Button, TextField, Typography } from "@mui/material";
import { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  function handleLogin() {
    const query = encodeURI(
      `select * from users where id = '${username}' and pwd = '${password}'`
    );
    console.log(query);
    fetch(`http://36.140.31.145:31684/dm/?query=${query}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data.results.length);
        if (data.results.length == 1) {
          localStorage.setItem("user", username);
          window.location.reload();
        } else {
          setPassword("");
          setMessage("错误信息：用户名或密码不正确");
        }
      });
  }
  return (
    <>
      <TextField
        id="username"
        label="用户名"
        variant="outlined"
        fullWidth
        sx={{ margin: "5px 0" }}
        defaultValue={username}
        onChange={(e) => {
          setUsername(e.target.value);
        }}
      />
      <TextField
        id="password"
        label="密码"
        variant="outlined"
        type="password"
        fullWidth
        sx={{ margin: "5px 0" }}
        defaultValue={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <Button fullWidth onClick={handleLogin}>
        <Typography variant="h6">登录</Typography>
      </Button>
      <div style={{ color: "red" }}>
        <Typography>{message}</Typography>
      </div>
    </>
  );
}
