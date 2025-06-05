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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  getAstList,
  getNotAstCC,
  getDataCCStats,
  getAstHistoricoExcel,
} from "../api/prevencionAPI";
import extractDate from "../helpers/main";
import { Link } from "react-router-dom";

function FormAstList() {
  const authState = useSelector((state) => state.auth);
  const { token } = authState;
  const [data, setData] = useState(undefined);
  const [dataStatsCC, setDataStatsCC] = useState(undefined);
  const [dataStatsCCFiltered, setDataStatsCCFiltered] = useState(undefined);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const handlePage = (newPage) => setPage(newPage);
  const [centroCosto, setCentroCosto] = useState({ centro: "VTR RM" });

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await getAstList(token, page);
      setData(res.data);
      setPages(res.pages);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDataAstByCC = async () => {
    try {
      const res = await getDataCCStats(token, centroCosto);
      setDataStatsCCFiltered(res);
    } catch (error) {
      console.log(error);
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

  const fetchNotAstCC = async () => {
    try {
      const res = await getNotAstCC(token);
      setDataStatsCC(res);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  const getExcel = async () => {
    setIsSubmitting(true);
    try {
      await getAstHistoricoExcel(token);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadExcel = () => (
    <Box
      sx={{
        width: "90%",
        mb: 2,
        display: "flex",
        justifyContent: "start",
      }}
    >
      <Button
        variant="contained"
        onClick={getExcel}
        disabled={isSubmitting}
        sx={{
          width: 250,
          height: 40,
          fontWeight: "bold",
          display: "flex",
          justifyContent: "space-around",
          borderRadius: "20px",
          background: "#0b2f6d",
        }}
      >
        {isSubmitting ? "Procesando...":"Descargar Excel"}
      </Button>
    </Box>
  );

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

  const statsCard = () => (
    <>
      <Card
        sx={{
          width: "90%",
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
              DATOS NO REALIZADAS
            </Typography>
          }
          avatar={<SearchIcon />}
          action={
            <Button
              onClick={toggleFilters}
              sx={{ color: "white", minWidth: "auto" }}
            >
              {showFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </Button>
          }
          sx={{
            background: "#0b2f6d",
            color: "white",
            textAlign: "end",
          }}
        />
        {showFilters && dataStatsCC ? (
          <CardContent>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
              {setTableStatsCC()}
              {setTableStatsCCFilteres()}
            </Box>
          </CardContent>
        ) : null}
      </Card>
    </>
  );

  const setTableStatsCC = () => (
    <TableContainer
      sx={{
        maxHeight: 350,
        minHeight: 250,
        overflowY: "auto",
      }}
    >
      <Table
        sx={{ width: "100%", display: "column", justifyContent: "center" }}
      >
        {setTableHeadStatsCC()}
        {setTableBodyStatsCC()}
      </Table>
    </TableContainer>
  );

  const setTableStatsCCFilteres = () => (
    <TableContainer
      sx={{
        maxHeight: 350,
        minHeight: 250,
        overflowY: "auto",
      }}
    >
      <Table
        stickyHeader
        sx={{ width: "100%", display: "column", justifyContent: "center" }}
      >
        {setTableHeadStatsCCFiltered()}
        {setTableBodyStatsCCFiltered()}
      </Table>
    </TableContainer>
  );

  const setTableHeadStatsCC = () => (
    <>
      <TableHead>
        <TableRow>
          {["CANTIDAD NO REALIZADAS", "CENTRO COSTO"].map((header, index) => (
            <TableCell
              key={header}
              align="center"
              sx={{
                background: "#0b2f6d",
                fontWeight: "bold",
                fontSize: "10px",
                color: "#ffffff",
              }}
            >
              {header}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    </>
  );

  const setTableHeadStatsCCFiltered = () => (
    <>
      <TableHead>
        <TableRow>
          {["NOMBRE", "RUT"].map((header, index) => (
            <TableCell
              key={header}
              align="center"
              sx={{
                background: "#0b2f6d",
                fontWeight: "bold",
                fontSize: "10px",
                color: "#ffffff",
              }}
            >
              {header}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    </>
  );

  const setTableBodyStatsCC = () => (
    <>
      <TableBody
        sx={{
          display: "column",
          justifyContent: "center",
          backgroundColor: "#ffffff",
        }}
      >
        {dataStatsCC && dataStatsCC.length > 0 ? (
          dataStatsCC.map((row, index) => (
            <TableRow
              sx={{
                textDecoration: "none",
                cursor: "pointer",
                "&:hover": { backgroundColor: "#f5f5f5" }, // Cambio de color al pasar el mouse
              }}
              key={index}
              onClick={() => {
                setCentroCosto({ centro: row.CENTRO_COSTO });
              }}
            >
              <TableCell
                align="center"
                sx={{ fontSize: "10px", width: "10%" }} // Equal width
              >
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.Q ? row.Q : "Sin Información"}
                </Typography>
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontSize: "10px", width: "10%" }} // Equal width
              >
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.CENTRO_COSTO ? row.CENTRO_COSTO : "Sin Información"}
                </Typography>
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

  const setTableBodyStatsCCFiltered = () => (
    <>
      <TableBody
        sx={{
          display: "column",
          justifyContent: "center",
          backgroundColor: "#ffffff",
        }}
      >
        {dataStatsCCFiltered && dataStatsCCFiltered.length > 0 ? (
          dataStatsCCFiltered.map((row, index) => (
            <TableRow
              sx={{
                textDecoration: "none",
                cursor: "pointer",
                "&:hover": { backgroundColor: "#f5f5f5" }, // Cambio de color al pasar el mouse
              }}
              key={index}
            >
              <TableCell
                align="center"
                sx={{ fontSize: "10px", width: "10%" }} // Equal width
              >
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.nombre ? row.nombre : "Sin Información"}
                </Typography>
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontSize: "10px", width: "10%" }} // Equal width
              >
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.numDoc ? row.numDoc : "Sin Información"}
                </Typography>
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

  const tableHeaders = [
    { label: "FECHA", width: "25%" },
    { label: "USUARIO", width: "25%" },
    { label: "RUT", width: "25%" },
    { label: "CENTRO COSTO", width: "25%" },
  ];

  const setTableHead = () => (
    <>
      <TableHead>
        <TableRow>
          {tableHeaders.map((header, idx) => (
            <TableCell
              key={header.label}
              align="center"
              sx={{
                background: "#d8d8d8",
                fontWeight: "bold",
                width: header.width,
              }}
            >
              {header.label}
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
            <TableRow
              component={Link}
              to={`/formulario-ast/${row.formID}`}
              sx={{
                textDecoration: "none",
                cursor: "pointer",
                "&:hover": { backgroundColor: "#f5f5f5" }, // Cambio de color al pasar el mouse
              }}
              key={index}
            >
              <TableCell align="center" sx={{ fontSize: "12px", width: "25%" }}>
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.fechaForm
                    ? extractDate(row.fechaForm)
                    : "Sin Información"}
                </Typography>
              </TableCell>
              <TableCell align="center" sx={{ fontSize: "12px", width: "25%" }}>
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.nombre ? row.nombre : "Sin Información"}
                </Typography>
              </TableCell>
              <TableCell align="center" sx={{ fontSize: "12px", width: "25%" }}>
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.numDoc ? row.numDoc : "Sin Información"}
                </Typography>
              </TableCell>
              <TableCell align="center" sx={{ fontSize: "12px", width: "25%" }}>
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.CENTRO_COSTO ? row.CENTRO_COSTO : "Sin Información"}
                </Typography>
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
  }, [page]);

  useEffect(() => {
    fetchNotAstCC();
  }, []);

  useEffect(() => {
    fetchDataAstByCC();
  }, [centroCosto]);

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
      {statsCard()}
      {downloadExcel()}
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
          <Skeleton variant="rounded" width={"70%"} height={"100%"} />
        </Box>
      ) : (
        <>
          <Card sx={{ width: "90%", borderRadius: "10px", boxShadow: 5 }}>
            <CardHeader
              title={
                <Typography fontWeight="bold" sx={{ fontFamily: "initial" }}>
                  DATOS AST REALIZADAS
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
