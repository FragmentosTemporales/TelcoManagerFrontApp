import {
  Autocomplete,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  TableHead,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import SearchIcon from "@mui/icons-material/Search";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getUsers } from "../api/authAPI";
import { getAstList, getAstListUser } from "../api/prevencionAPI";
import extractDate from "../helpers/main";
import { Link } from "react-router-dom";

function FormAstList() {
  const authState = useSelector((state) => state.auth);
  const { token } = authState;
  const [data, setData] = useState(undefined);
  const [pages, setPages] = useState(1);
  const [dataUsers, setDataUsers] = useState(undefined);
  const [tecnicoID, setTecnicoID] = useState("");
  const [page, setPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePage = (newPage) => setPage(newPage);

  const fetchData = async () => {
    try {
      setIsSubmitting(true);
      const res =
        tecnicoID === ""
          ? await getAstList(token, page)
          : await getAstListUser(token, tecnicoID, page);
      setData(res.data);
      setPages(res.pages);
      setIsSubmitting(false);
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
    }
  };
  const setTable = () => (
    <>
      <TableContainer>
        <Table
          sx={{ width: "100%", display: "column", justifyContent: "center" }}
        >
          {setTableHead()}
          {setTableBody()}
        </Table>
      </TableContainer>
    </>
  );

  const handleClear = async (e) => {
    e.preventDefault();
    setTecnicoID("");
  };

  const getButtons = () => (
    <>
      <Button
        key="prev"
        variant="contained"
        onClick={() => handlePage(page - 1)}
        disabled={page === 1}
        sx={{ background: "#0b2f6d" }}
      >
        <ArrowBackIosIcon />
      </Button>
      <Button key="current" variant="contained" sx={{ background: "#0b2f6d" }}>
        {page}
      </Button>
      <Button
        key="next"
        variant="contained"
        onClick={() => handlePage(page + 1)}
        disabled={page === pages}
        sx={{ background: "#0b2f6d" }}
      >
        <ArrowForwardIosIcon />
      </Button>
    </>
  );

  const filterCard = () => (
    <>
      <Card
        sx={{
          width: "70%",
          overflow: "hidden",
          backgroundColor: "#f5f5f5",
          boxShadow: 5,
          textAlign: "center",
          borderRadius: "0px",
          mt: 2,
          mb: 2,
        }}
      >
        <CardHeader
          title={
            <Typography fontWeight="bold" sx={{ fontFamily: "initial" }}>
              FILTRAR FORMULARIO POR TRABAJADOR
            </Typography>
          }
          avatar={<SearchIcon />}
          sx={{
            background: "#0b2f6d",
            color: "white",
            textAlign: "end",
          }}
        />
        {dataUsers ? (
          <CardContent>
            <form>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <Autocomplete
                  value={
                    dataUsers.find((option) => option.value === tecnicoID) ||
                    null
                  } // Aseguramos que el valor sea un objeto o null
                  onChange={(event, newValue) => {
                    setTecnicoID(newValue ? newValue.value : ""); // Si newValue es null, asignamos una cadena vacía
                  }}
                  options={dataUsers}
                  getOptionLabel={(option) => option.label}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Trabajador"
                      required
                      sx={{ minWidth: "200px", height: "40px" }}
                    />
                  )}
                />

                <Button
                  variant="contained"
                  onClick={handleClear}
                  sx={{
                    fontWeight: "bold",
                    background: "#0b2f6d",
                    minWidth: "200px",
                    height: "40px",
                  }}
                >
                  LIMPIAR FILTROS
                </Button>

                <Button
                  variant="contained"
                  onClick={fetchData}
                  sx={{
                    fontWeight: "bold",
                    background: "#0b2f6d",
                    minWidth: "200px",
                    height: "40px",
                  }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Procesando..." : "Actualizar"}
                </Button>
              </Box>
            </form>
          </CardContent>
        ) : null}
      </Card>
    </>
  );

  const setTableHead = () => (
    <>
      <TableHead>
        <TableRow>
          {["FECHA", "USUARIO", "UBICACION", "ACCIONES"].map((header) => (
            <TableCell
              key={header}
              align="center"
              sx={{ background: "#d8d8d8", fontWeight: "bold" }}
            >
              {header}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    </>
  );
  const setTableBody = () => (
    <>
      <TableBody
        sx={{
          display: "column",
          justifyContent: "center",
        }}
      >
        {data && data.length > 0 ? (
          data.map((row, index) => (
            <TableRow key={index}>
              <TableCell align="center" sx={{ fontSize: "16px" }}>
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.fechaForm
                    ? extractDate(row.fechaForm)
                    : "Sin Información"}
                </Typography>
              </TableCell>
              <TableCell align="center" sx={{ fontSize: "16px" }}>
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.usuario ? row.usuario.nombre : "Sin Información"}
                </Typography>
              </TableCell>
              <TableCell align="center" sx={{ fontSize: "16px" }}>
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.lugar ? row.lugar : "Sin Información"}
                </Typography>
              </TableCell>
              <TableCell align="center" sx={{ fontSize: "16px" }}>
                <Link to={`/formulario-ast/${row.formID}`}>
                  <Button
                    variant="contained"
                    color="info"
                    onClick={() => {
                      console.log("PRESIONADO");
                    }}
                  >
                    ver
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} align="center">
              No hay datos disponibles
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </>
  );

  const fetchUsers = async () => {
    const res = await getUsers(token);
    const data = res.map((item) => ({
      value: item.userID,
      label: item.nombre,
    }));
    setDataUsers(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchData();
  }, [page]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background: "white",
        alignItems: "center",
        pt: 8,
        height: "100%",
      }}
    >
      {filterCard()}

      <Card sx={{ width: "70%", borderRadius: "0", boxShadow: 5 }}>
        <CardHeader
          title={
            <Typography fontWeight="bold" sx={{ fontFamily: "initial" }}>
              REGISTROS FORMULARIO AST
            </Typography>
          }
          sx={{
            background: "#0b2f6d",
            color: "white",
            textAlign: "end",
          }}
        />

        <CardContent>{setTable()}</CardContent>
      </Card>
      <ButtonGroup
        size="small"
        aria-label="pagination-button-group"
        sx={{ p: 2 }}
      >
        {getButtons()}
      </ButtonGroup>
    </Box>
  );
}

export default FormAstList;
