import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Menu from "./components/Menu";
import Mysql from "./components/Mysql";
import Minio from "./components/Minio";
import Hdfs from "./components/Hdfs";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Menu />
              </>
            }
          />
          <Route
            path="/mysql_input/"
            element={
              <>
                <Mysql />
              </>
            }
          />
          <Route
            path="/minio_input/"
            element={
              <>
                <Minio />
              </>
            }
          />
          <Route
            path="/hdfs_input/"
            element={
              <>
                <Hdfs />
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}
