import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Menu from "./components/Menu";
import Mysql from "./components/Mysql";
import Minio from "./components/Minio";
import Hdfs from "./components/Hdfs";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import Home from "./components/Home";

export default function App() {
  return (
    <div className="main">
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              href="/"
            >
              <img src="/menu.png" style={{ height: 30, width: 30 }}></img>
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              物流数据平台
            </Typography>
            <div>
              <Button color="inherit" href="/input/">
                数据导入
              </Button>
              <Button color="inherit">文档手册</Button>
              <Button color="inherit">登录 / 注册</Button>
            </div>
          </Toolbar>
        </AppBar>
      </Box>
      <div style={{ marginTop: "5%" }}>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Home />
                </>
              }
            />
            <Route
              path="/input/"
              element={
                <>
                  <Menu />
                </>
              }
            />
            <Route
              path="/mysql/"
              element={
                <>
                  <Mysql />
                </>
              }
            />
            <Route
              path="/minio/"
              element={
                <>
                  <Minio />
                </>
              }
            />
            <Route
              path="/hdfs/"
              element={
                <>
                  <Hdfs />
                </>
              }
            />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}
