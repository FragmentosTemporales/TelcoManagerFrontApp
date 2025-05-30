import {
  Alert,
  Autocomplete,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Skeleton,
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
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getAstList, getAstListUser, getAstUsers } from "../api/prevencionAPI";
import extractDate from "../helpers/main";
import { Link } from "react-router-dom";

function FormAstList() {
  const authState = useSelector((state) => state.auth);
  const { token } = authState;
  const [data, setData] = useState(undefined);
  const [pages, setPages] = useState(1);
  const [dataUsers, setDataUsers] = useState([]);
  const [tecnicoID, setTecnicoID] = useState("");
  const [page, setPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const handlePage = (newPage) => setPage(newPage);

  const fetchData = async () => {
    try {
      setIsSubmitting(true);
      setIsLoading(true)
      const res =
        tecnicoID === ""
          ? await getAstList(token, page)
          : await getAstListUser(token, tecnicoID, page);
      setData(res.data);
      setPages(res.pages);
      setIsSubmitting(false);
      setIsLoading(false);
    } catch (error) {
      console.log(error)
      setIsLoading(false);
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

  const fetchAstUsers = async () => {
    try {
      const res = await getAstUsers(token)
      setDataUsers(res)
    } catch(error){
      console.log(error)
    }
  }

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
          borderRadius: "10px",
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
            <Grid
              container
              spacing={2}
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <Grid item xs={12} md={12} lg={6} sx={{width:'100%'}}>
                <Autocomplete
                  value={
                    dataUsers.find((option) => option.value === tecnicoID) || null
                  }
                  onChange={(event, newValue) => {
                    setTecnicoID(newValue ? newValue.value : "");
                  }}
                  options={dataUsers}
                  getOptionLabel={(option) => option.label}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Trabajador"
                      required
                      sx={{ width: "100%" }}
                    />
                  )}
                />
              </Grid>
        
              <Grid item xs={12} md={12} lg={3} sx={{width:'100%'}}>
                <Button
                  variant="contained"
                  onClick={handleClear}
                  sx={{
                    fontWeight: "bold",
                    background: "#0b2f6d",
                    width: "100%",
                    height: "40px",
                  }}
                >
                  LIMPIAR FILTROS
                </Button>
              </Grid>
        
              <Grid item xs={12} md={12} lg={3} sx={{width:'100%'}}>
                <Button
                  variant="contained"
                  onClick={fetchData}
                  sx={{
                    fontWeight: "bold",
                    background: "#0b2f6d",
                    width: "100%",
                    height: "40px",
                  }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Procesando..." : "Actualizar"}
                </Button>
              </Grid>
            </Grid>
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
                    sx={{ background: "#0b2f6d", borderRadius: "10px" }}
                  >
                    <VisibilityIcon />
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

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchAstUsers();
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
      {isLoading ? (
        <Box
          sx={{
            width: "100%",
            height: "90vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Skeleton
            variant="rounded"
            width={"70%"}
            height={"100%"}
          />
        </Box>
      ) : (
        <>
          <Card sx={{ width: "70%", borderRadius: "10px", boxShadow: 5 }}>
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
        </>
      )}
    </Box>
  );
}

export default FormAstList;
