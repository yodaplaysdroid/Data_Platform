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
  MenuItem,
  Select,
  Toolbar,
  Typography,
} from "@mui/material";
import Home from "./components/Home";
import Fix from "./components/Fix";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";

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
              <Select
                value=""
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                size="small"
                sx={{ color: "aliceblue" }}
              >
                <MenuItem value="">
                  <em>选择表格</em>
                </MenuItem>
                <MenuItem>
                  <Button href="/fix/物流公司">物流公司</Button>
                </MenuItem>
                <MenuItem>
                  <Button href="/fix/客户信息">客户信息</Button>
                </MenuItem>
                <MenuItem>
                  <Button href="/fix/物流信息">物流信息</Button>
                </MenuItem>
                <MenuItem>
                  <Button href="/fix/集装箱动态">集装箱动态</Button>
                </MenuItem>
                <MenuItem>
                  <Button href="/fix/装货表">装货表</Button>
                </MenuItem>
                <MenuItem>
                  <Button href="/fix/卸货表">卸货表</Button>
                </MenuItem>
              </Select>
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
