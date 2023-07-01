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
          height: "85vh",
        }}
      >
        <Card id="mysql" sx={{ width: 300 }} onClick={handleOpen}>
          <CardActionArea>
            <CardMedia component="img" image="/mysql.png" />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                MySQL 数据导入
              </Typography>
              <Typography variant="body2" color="text.secondary">
                A relational database management system (RDBMS) developed by
                Oracle that is based on SQL.
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
        <Card id="minio" sx={{ width: 300 }} onClick={handleOpen}>
          <CardActionArea>
            <CardMedia component="img" image="/minio.png" />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                MinIO 数据导入
              </Typography>
              <Typography variant="body2" color="text.secondary">
                An Apache licensed open source distributed object server that
                can help you here, and do a lot more.
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
        <Card id="hdfs" sx={{ width: 300 }} onClick={handleOpen}>
          <CardActionArea>
            <CardMedia component="img" image="/hdfs.png" />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                HDFS 数据导入
              </Typography>
              <Typography variant="body2" color="text.secondary">
                A distributed file system that handles large data sets running
                on commodity hardware.
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
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
              overflow: "scroll",
            }}
          >
            {fs === "mysql" ? <Mysql /> : null}
            {fs === "minio" ? <Minio /> : null}
            {fs === "hdfs" ? <Hdfs /> : null}
          </Box>
        </Modal>
      </div>
    </>
  );
}
