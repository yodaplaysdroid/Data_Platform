import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Container,
  Modal,
  Typography,
} from "@mui/material";
import { useState } from "react";
import Minio from "./Minio";
import Mysql from "./Mysql";
import Hdfs from "./Hdfs";
import Local from "./Local";

export default function Menu() {
  const [open, setOpen] = useState(false);
  function handleOpen(e: React.MouseEvent) {
    setFs(e.currentTarget.id);
    setOpen(true);
  }
  const handleClose = () => setOpen(false);
  const [fs, setFs] = useState("");

  return (
    <>
      <Container
        sx={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          height: "75vh",
        }}
      >
        <Card id="mysql" sx={{ width: 250, height: 420 }} onClick={handleOpen}>
          <CardActionArea>
            <CardMedia component="img" image="/mysql.png" />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                MySQL 数据导入
              </Typography>
              <Typography variant="body2" color="text.secondary">
                支持 MySQL 数据库的连接，并把从 MySQL
                的源数据通过治理过程后存储在系统的里。
                <br />
                <br />
                <br />
                <br />
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
        <Card id="minio" sx={{ width: 250, height: 420 }} onClick={handleOpen}>
          <CardActionArea>
            <CardMedia component="img" image="/minio.png" />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                MinIO 数据导入
              </Typography>
              <Typography variant="body2" color="text.secondary">
                连接 MinIO
                存储，并提取在存储内的文件信息，动态配置文件选项，经过治理过程后将把数据存储在系统数据库里。
                <br />
                <br />
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
        <Card id="hdfs" sx={{ width: 250, height: 420 }} onClick={handleOpen}>
          <CardActionArea>
            <CardMedia component="img" image="/hdfs.png" />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                HDFS 数据导入
              </Typography>
              <Typography variant="body2" color="text.secondary">
                通过 rClone 服务连接远程 HDFS
                存储，并提取在存储内的文件信息，动态配置文件选项，经过治理过程后将把数据存储在系统数据库里。
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
        <Card id="local" sx={{ width: 250, height: 420 }} onClick={handleOpen}>
          <CardActionArea>
            <CardMedia component="img" image="/local.jpg" />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                本地文件上传
              </Typography>
              <Typography variant="body2" color="text.secondary">
                支持本地上传 CSV, EXCEL 以及 TSV 源数据。
                <br />
                <br />
                <br />
                <br />
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Container>
      <div>
        <Modal
          open={open}
          onClose={handleClose}
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
              height: 600,
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
              overflow: "scroll",
            }}
          >
            {fs === "mysql" ? <Mysql /> : null}
            {fs === "minio" ? <Minio /> : null}
            {fs === "hdfs" ? <Hdfs /> : null}
            {fs === "local" ? <Local /> : null}
          </Box>
        </Modal>
      </div>
    </>
  );
}
