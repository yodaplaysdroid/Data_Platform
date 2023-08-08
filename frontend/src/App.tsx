import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Menu from "./components/Menu";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Modal,
  Popover,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import FaceIcon from "@mui/icons-material/Face";
import Home from "./components/Home";
import Fix from "./components/Fix";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import { useState } from "react";
import Documentation from "./components/Documentation";
import Map from "./components/Map";
import Api from "./components/Api";
import Login from "./components/Login";

export default function App() {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

  const [anchorEl1, setAnchorEl1] = useState<HTMLButtonElement | null>(null);

  const handleClick1 = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl1(event.currentTarget);
  };

  const handleClose1 = () => {
    setAnchorEl1(null);
  };
  const open1 = Boolean(anchorEl1);

  const [open2, setOpen2] = useState(false);
  function handleOpen2() {
    setOpen2(true);
  }
  const handleClose2 = () => setOpen2(false);

  return (
    <div className="main">
      {window.location.pathname !== "/map/" ? (
        <>
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
                  style={{
                    marginLeft: 10,
                    marginRight: 5,
                    height: 30,
                    width: 30,
                  }}
                ></img>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  物流数据平台
                </Typography>
                <div>
                  <Button color="inherit" href="/api/">
                    数据库共享
                  </Button>
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
                    <Button
                      href="/fix/物流公司"
                      sx={{ width: 100, height: 50 }}
                    >
                      物流公司
                    </Button>
                    <br />
                    <Button
                      href="/fix/客户信息"
                      sx={{ width: 100, height: 50 }}
                    >
                      客户信息
                    </Button>
                    <br />
                    <Button
                      href="/fix/物流信息"
                      sx={{ width: 100, height: 50 }}
                    >
                      物流信息
                    </Button>
                    <br />
                    <Button
                      href="/fix/集装箱动态"
                      sx={{ width: 100, height: 50 }}
                    >
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
                  <Button color="inherit" href="/docs/">
                    用户手册
                  </Button>
                  <Tooltip title="Profile">
                    <IconButton color="inherit" onClick={handleClick1}>
                      <FaceIcon fontSize="large" />
                    </IconButton>
                  </Tooltip>
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
                    {localStorage.getItem("user") == null ||
                    localStorage.getItem("user") == "" ? (
                      <Button
                        sx={{ width: 150, height: 50 }}
                        onClick={handleOpen2}
                      >
                        <div style={{ fontSize: 18, color: "inherit" }}>
                          登陆账号
                        </div>
                      </Button>
                    ) : (
                      <div>
                        <Button sx={{ minWidth: 150, minHeight: 50 }}>
                          <div style={{ fontSize: 15, color: "grey" }}>
                            USER ID : {localStorage.getItem("user")}
                          </div>
                        </Button>
                        <br />
                        <Button
                          sx={{ minWidth: 150, minHeight: 30 }}
                          onClick={() => {
                            localStorage.setItem("user", "");
                            window.location.reload();
                          }}
                        >
                          <div style={{ fontSize: 18, color: "red" }}>退出</div>
                        </Button>
                      </div>
                    )}
                  </Popover>
                </div>
              </Toolbar>
            </AppBar>
          </Box>
          <Modal
            open={open2}
            onClose={handleClose2}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box
              sx={{
                position: "absolute" as "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 600,
                height: 200,
                bgcolor: "background.paper",
                borderRadius: 2,
                boxShadow: 24,
                p: 4,
              }}
            >
              <Login />
            </Box>
          </Modal>
        </>
      ) : null}
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
                  {localStorage.getItem("user") == null ||
                  localStorage.getItem("user") == "" ? (
                    <Navigate to="/login/" replace={true} />
                  ) : (
                    <Menu />
                  )}
                </>
              }
            />
            <Route
              path="/fix/:table"
              element={
                <>
                  {localStorage.getItem("user") == null ||
                  localStorage.getItem("user") == "" ? (
                    <Navigate to="/login/" replace={true} />
                  ) : (
                    <Fix />
                  )}
                </>
              }
            />
            <Route
              path="/docs/"
              element={
                <>
                  <Documentation />
                </>
              }
            />
            <Route
              path="/map/"
              element={
                <>
                  <Map />
                </>
              }
            />
            <Route
              path="/api/"
              element={
                <>
                  <Api />
                </>
              }
            />
            <Route
              path="/login/"
              element={
                <>
                  {localStorage.getItem("user") == null ||
                  localStorage.getItem("user") == "" ? (
                    <div
                      style={{
                        position: "absolute",
                        top: "40%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 600,
                        height: 200,
                      }}
                    >
                      <Typography variant="h5" align="center" color="primary">
                        登陆界面
                      </Typography>
                      <br />
                      <br />
                      <Login />
                    </div>
                  ) : (
                    <Navigate to="/" replace={true} />
                  )}
                </>
              }
            />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}
