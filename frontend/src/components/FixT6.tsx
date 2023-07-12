import { alpha } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import {
  TableHead,
  TableRow,
  TableCell,
  Checkbox,
  TableSortLabel,
  Box,
  Toolbar,
  Typography,
  Tooltip,
  IconButton,
  Paper,
  TableContainer,
  Table,
  TableBody,
  TablePagination,
  FormControlLabel,
  Switch,
  CircularProgress,
  Modal,
} from "@mui/material";
import { useMemo, useState } from "react";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import Edit from "./Edit";
import Shortcut from "./Shortcut";

export default function FixT6() {
  const t = localStorage.getItem("t");
  const data = t ? JSON.parse(t) : "";
  console.log(data);

  interface Data {
    id: number;
    错误类型: string;
    船公司: string;
    船名称: string;
    作业开始时间: string;
    作业结束时间: string;
    始发时间: string;
    到达时间: string;
    作业港口: string;
    提单号: string;
    集装箱箱号: string;
    箱尺寸_TEU: string;
    启运地: string;
    目的地: string;
  }

  function createData(
    id: number,
    错误类型: string,
    船公司: string,
    船名称: string,
    作业开始时间: string,
    作业结束时间: string,
    始发时间: string,
    到达时间: string,
    作业港口: string,
    提单号: string,
    集装箱箱号: string,
    箱尺寸_TEU: string,
    启运地: string,
    目的地: string
  ): Data {
    return {
      id,
      错误类型,
      船公司,
      船名称,
      作业开始时间,
      作业结束时间,
      始发时间,
      到达时间,
      作业港口,
      提单号,
      集装箱箱号,
      箱尺寸_TEU,
      启运地,
      目的地,
    };
  }
  const rows: Data[] = [];
  for (let i in data) {
    rows.push(
      createData(
        data[i][13],
        data[i][12],
        data[i][0],
        data[i][1],
        data[i][2],
        data[i][3],
        data[i][4],
        data[i][5],
        data[i][6],
        data[i][7],
        data[i][8],
        data[i][9],
        data[i][10],
        data[i][11]
      )
    );
  }

  function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  type Order = "asc" | "desc";

  function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key
  ): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string }
  ) => number {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  // Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
  // stableSort() brings sort stability to non-modern browsers (notably IE11). If you
  // only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
  // with exampleArray.slice().sort(exampleComparator)
  function stableSort<T>(
    array: readonly T[],
    comparator: (a: T, b: T) => number
  ) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  interface HeadCell {
    disablePadding: boolean;
    id: keyof Data;
    label: string;
    numeric: boolean;
  }

  const headCells: readonly HeadCell[] = [
    {
      id: "id",
      numeric: false,
      disablePadding: true,
      label: "id",
    },
    {
      id: "错误类型",
      numeric: true,
      disablePadding: false,
      label: "错误类型",
    },
    {
      id: "船公司",
      numeric: true,
      disablePadding: false,
      label: "船公司",
    },
    {
      id: "船名称",
      numeric: true,
      disablePadding: false,
      label: "船名称",
    },
    {
      id: "作业开始时间",
      numeric: true,
      disablePadding: false,
      label: "作业开始时间",
    },
    {
      id: "作业结束时间",
      numeric: true,
      disablePadding: false,
      label: "作业结束时间",
    },
    {
      id: "始发时间",
      numeric: true,
      disablePadding: false,
      label: "始发时间",
    },
    {
      id: "到达时间",
      numeric: true,
      disablePadding: false,
      label: "到达时间",
    },
    {
      id: "作业港口",
      numeric: true,
      disablePadding: false,
      label: "作业港口",
    },
    {
      id: "提单号",
      numeric: true,
      disablePadding: false,
      label: "提单号",
    },
    {
      id: "集装箱箱号",
      numeric: true,
      disablePadding: false,
      label: "集装箱箱号",
    },
    {
      id: "箱尺寸_TEU",
      numeric: true,
      disablePadding: false,
      label: "箱尺寸（TEU）",
    },

    {
      id: "启运地",
      numeric: true,
      disablePadding: false,
      label: "启运地",
    },
    {
      id: "目的地",
      numeric: true,
      disablePadding: false,
      label: "目的地",
    },
  ];

  interface EnhancedTableProps {
    numSelected: number;
    onRequestSort: (
      event: React.MouseEvent<unknown>,
      property: keyof Data
    ) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
  }

  function EnhancedTableHead(props: EnhancedTableProps) {
    const {
      onSelectAllClick,
      order,
      orderBy,
      numSelected,
      rowCount,
      onRequestSort,
    } = props;
    const createSortHandler =
      (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
      };

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                "aria-label": "select all desserts",
              }}
            />
          </TableCell>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? "right" : "left"}
              padding={headCell.disablePadding ? "none" : "normal"}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  interface EnhancedTableToolbarProps {
    numSelected: number;
    selectedItems: readonly number[];
  }

  const [isLoading, setIsLoading] = useState(<></>);
  function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
    const { numSelected, selectedItems } = props;

    function handleDelete(e: any) {
      setIsLoading(<CircularProgress />);
      console.log(e);
      console.log(selectedItems);
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tablename: "卸货表",
          itemstodelete: selectedItems,
        }),
      };
      console.log(requestOptions);
      fetch(
        "http://36.140.31.145:31684/error_handler/delete_errors/",
        requestOptions
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setIsLoading(<></>);
          window.location.reload();
        });
    }
    const [open, setOpen] = useState(false);
    function handleOpen() {
      setOpen(true);
    }
    function handleClose() {
      setOpen(false);
    }

    return (
      <>
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            ...(numSelected > 0 && {
              bgcolor: (theme) =>
                alpha(
                  theme.palette.primary.main,
                  theme.palette.action.activatedOpacity
                ),
            }),
          }}
        >
          {numSelected > 0 ? (
            <Typography
              sx={{ flex: "1 1 100%" }}
              color="inherit"
              variant="subtitle1"
              component="div"
            >
              {numSelected} selected
            </Typography>
          ) : (
            <Typography
              sx={{ flex: "1 1 100%" }}
              variant="h6"
              id="tableTitle"
              component="div"
            >
              卸货表
            </Typography>
          )}
          {numSelected > 0 ? (
            <>
              {isLoading}
              {numSelected === 1 ? (
                <Tooltip title="Edit" onClick={handleOpenModal}>
                  <IconButton>
                    <EditRoundedIcon />
                  </IconButton>
                </Tooltip>
              ) : null}
              <Tooltip title="Delete" onClick={handleDelete}>
                <IconButton>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <Tooltip title="一键修改">
              <IconButton>
                <FilterListIcon onClick={handleOpen} />
              </IconButton>
            </Tooltip>
          )}
        </Toolbar>
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
              height: 200,
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Shortcut tableName="卸货表" />
          </Box>
        </Modal>
      </>
    );
  }

  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Data>("id");
  const [selected, setSelected] = useState<readonly number[]>([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (
    _event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (_event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage]
  );
  const [openModal, setOpenModal] = useState(false);
  function handleOpenModal(_e: React.MouseEvent) {
    setOpenModal(true);
  }
  const handleCloseModal = () => setOpenModal(false);

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <EnhancedTableToolbar
            numSelected={selected.length}
            selectedItems={selected}
          />
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={dense ? "small" : "medium"}
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {visibleRows.map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.id}
                      </TableCell>
                      <TableCell align="right">{row.错误类型}</TableCell>
                      <TableCell align="right">{row.船公司}</TableCell>
                      <TableCell align="right">{row.船名称}</TableCell>
                      <TableCell align="right">{row.作业开始时间}</TableCell>
                      <TableCell align="right">{row.作业结束时间}</TableCell>
                      <TableCell align="right">{row.始发时间}</TableCell>
                      <TableCell align="right">{row.到达时间}</TableCell>
                      <TableCell align="right">{row.作业港口}</TableCell>
                      <TableCell align="right">{row.提单号}</TableCell>
                      <TableCell align="right">{row.集装箱箱号}</TableCell>
                      <TableCell align="right">{row.箱尺寸_TEU}</TableCell>
                      <TableCell align="right">{row.启运地}</TableCell>
                      <TableCell align="right">{row.目的地}</TableCell>
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (dense ? 33 : 53) * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        <FormControlLabel
          control={<Switch checked={dense} onChange={handleChangeDense} />}
          label="Dense padding"
        />
      </Box>
      <div>
        <Modal
          open={openModal}
          onClose={handleCloseModal}
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
            <Edit tableName="卸货表" itemId={Number(selected)} />
          </Box>
        </Modal>
      </div>
    </>
  );
}
