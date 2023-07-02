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
  Popover,
  Toolbar,
  Typography,
} from "@mui/material";
import Home from "./components/Home";
import Fix from "./components/Fix";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import { useState } from "react";

export default function App() {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
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
              <HomeRoundedIcon />
            </IconButton>
            <img
              src="/icon.png"
              style={{ marginLeft: 10, marginRight: 5, height: 30, width: 30 }}
            ></img>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              物流数据平台
            </Typography>
            <div>
              <Button color="inherit" onClick={handleClick}>
                处理错误记录
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
                <Button href="/fix/物流公司" sx={{ width: 100, height: 50 }}>
                  物流公司
                </Button>
                <br />
                <Button href="/fix/客户信息" sx={{ width: 100, height: 50 }}>
                  客户信息
                </Button>
                <br />
                <Button href="/fix/物流信息" sx={{ width: 100, height: 50 }}>
                  物流信息
                </Button>
                <br />
                <Button href="/fix/集装箱动态" sx={{ width: 100, height: 50 }}>
                  集装箱动态
                </Button>
                <br />
                <Button href="/fix/装货表" sx={{ width: 100, height: 50 }}>
                  装货表
                </Button>
                <br />
                <Button href="/fix/卸货表" sx={{ width: 100, height: 50 }}>
                  卸货表
                </Button>
              </Popover>
              <Button color="inherit" href="/input/">
                数据导入
              </Button>
              <Button color="inherit">文档手册</Button>
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
            <Route
              path="/fix/:table"
              element={
                <>
                  <Fix />
                </>
              }
            />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}
