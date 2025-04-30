import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CardContent,
  TextField,
} from "@mui/material";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import BarChartIcon from "@mui/icons-material/BarChart";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSolicitudesFiltradas, getSolicitudesExcel } from "../api/solicitudAPI";
import { onLoad, onLoading, setMessage } from "../slices/solicitudSlice";
import filterData from "../data/filterSolicitud";
import SolicitudCharts from "../components/solicitudesCharts";

function Solicitudes() {
  const authState = useSelector((state) => state.auth);
  const solicitudState = useSelector((state) => state.solicitud);
  const { token } = authState;
  const { message, data, is_loading, is_load, pages } = solicitudState;
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [page, setPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);

  const [toFilter, setToFilter] = useState({ folio: "", estado: "" });

  const handleClose = () => setOpen(false);

  const fetchData = async () => {
    try {
      dispatch(onLoading());
      setIsSubmitting(true);
      const res = await getSolicitudesFiltradas(token, toFilter, page);
      dispatch(onLoad(res));
      setIsSubmitting(false);
    } catch (error) {
      dispatch(setMessage("Información no encontrada."));
      setOpen(true);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  useEffect(() => {
    setPage(1);
  }, [toFilter]);

  const handleClear = async (e) => {
    e.preventDefault();
    try {
      setToFilter({ folio: "", estado: "" });
      setPage(1); // Reset to the first page
      await getSolicitudesFiltradas(token, { folio: "", estado: "" }, 1).then((res) => {
        dispatch(onLoad(res));
      });
    } catch (error) {
      dispatch(setMessage("Error al limpiar los filtros."));
      setOpen(true);
    }
  };

  const fetchOptions = () => {
    const transformedOptions = filterData.map((item) => ({
      value: item.descri,
      label: item.descri,
    }));
    setOptions(transformedOptions);
  };

    const getExcel = async () => {
      try {
        await getSolicitudesExcel(token);
      } catch (error) {
        console.log(error);
      }
    };

  const handlePage = (newPage) => setPage(newPage);

  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  const toggleStatistics = () => {
    setShowStatistics((prev) => !prev);
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
    <Card
      sx={{
        width: "80%",
        overflow: "hidden",
        backgroundColor: "#f5f5f5",
        boxShadow: 5,
        textAlign: "center",
        borderRadius: "20px",
        mt: 2,
      }}
    >
      <CardHeader
        title={
          <Typography fontWeight="bold" sx={{ fontFamily: "initial" }}>
            FILTRAR SOLICITUDES
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
      {showFilters && (
        <CardContent>
          <form>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <TextField
                id="folio-input"
                label="Folio"
                variant="outlined"
                value={toFilter.folio || ""}
                onChange={(event) => {
                  setToFilter((prev) => ({
                    ...prev,
                    folio: event.target.value,
                  }));
                }}
                sx={{ minWidth: "200px" }}
                size="small"
              />
              <Select
                labelId="estado-label"
                required
                id="estado-select"
                value={toFilter.estado || ""}
                sx={{ minWidth: "200px" }}
                size="small"
                onChange={(event) => {
                  setToFilter((prev) => ({
                    ...prev,
                    estado: event.target.value,
                  }));
                }}
              >
                {options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>

              <Button
                variant="contained"
                onClick={handleClear}
                sx={{
                  fontWeight: "bold",
                  background: "#0b2f6d",
                  minWidth: "200px",
                  height: "40px",
                  borderRadius: "20px",
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
                  borderRadius: "20px",
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Procesando..." : "Actualizar"}
              </Button>
            </Box>
          </form>
        </CardContent>
      )}
    </Card>
  );

  const statisticsCard = () => (
    <Card
      sx={{
        width: "80%",
        overflow: "hidden",
        backgroundColor: "#f5f5f5",
        boxShadow: 5,
        textAlign: "center",
        borderRadius: "20px",
        mt: 2,
      }}
    >
      <CardHeader
        title={
          <Typography fontWeight="bold" sx={{ fontFamily: "initial" }}>
            ESTADISTICAS DE SOLICITUDES
          </Typography>
        }
        avatar={<BarChartIcon />}
        action={
          <Button
            onClick={toggleStatistics}
            sx={{ color: "white", minWidth: "auto" }}
          >
            {showStatistics ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </Button>
        }
        sx={{
          background: "#0b2f6d",
          color: "white",
          textAlign: "end",
        }}
      />
      {showStatistics && (
        <CardContent>
          <SolicitudCharts />
        </CardContent>
      )}
    </Card>
  );

  const createNew = () => (
    <Box
      sx={{
        width: "80%",
        mt: 2,
        display: "flex",
        justifyContent: "start",
      }}
    >
      <Link style={{ color: "white", textDecoration: "none" }} to="/create">
        <Button
          variant="contained"
          color="error"
          sx={{
            width: 200,
            height: 40,
            fontWeight: "bold",
            display: "flex",
            justifyContent: "space-around",
            borderRadius: "20px",
          }}
        >
          <AddCircleOutlineIcon /> Crear Nueva
        </Button>
      </Link>
    </Box>
  );

  const downloadExcel = () => (
    <Box
      sx={{
        width: "80%",
        mt: 2,
        display: "flex",
        justifyContent: "start",
      }}
    >
        <Button
          variant="contained"
          onClick={getExcel}
          sx={{
            width: 200,
            height: 40,
            fontWeight: "bold",
            display: "flex",
            justifyContent: "space-around",
            borderRadius: "20px",
            background: "#0b2f6d",
          }}
        >
          <InsertDriveFileIcon /> Descargar
        </Button>
    </Box>
  );

  const setTableHead = () => (
    <TableHead>
      <TableRow>
        {[
          "N° FOLIO",
          "MOTIVO",
          "FORMULARIO",
          "SOLICITANTE",
          "AMONESTADO",
          "ESTADO",
        ].map((header) => (
          <TableCell key={header} align="center">
            <Typography fontFamily="initial">{header}</Typography>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );

  const setTableBody = () => (
    <TableBody>
      {data && data.length > 0 ? (
        data.map((row, index) => (
          <TableRow
            key={index}
            component={Link}
            to={`/solicitud/${row.solicitudID}`}
            sx={{
              textDecoration: "none",
              cursor: "pointer",
              "&:hover": { backgroundColor: "#f5f5f5" }, // Cambio de color al pasar el mouse
            }}
          >
            <TableCell align="center" sx={{ fontSize: "12px" }}>
              {row.Folio ? row.Folio : "Sin Folio"}
            </TableCell>
            <TableCell align="center" sx={{ fontSize: "12px" }}>
              {row.Motivo ? row.Motivo : "Sin Información"}
            </TableCell>
            <TableCell align="center" sx={{ fontSize: "12px" }}>
              {row.Formulario ? row.Formulario : "Sin área asignada"}
            </TableCell>
            <TableCell align="center" sx={{ fontSize: "12px" }}>
              {row.Solicitante ? row.Solicitante : "Sin Información"}
            </TableCell>
            <TableCell align="center" sx={{ fontSize: "12px" }}>
              {row.Amonestado ? row.Amonestado : "Sin Información"}
            </TableCell>
            <TableCell align="center" sx={{ fontSize: "12px" }}>
              {row.Estado ? row.Estado : "Sin Información"}
            </TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={12} align="center">
            <Typography fontFamily="initial">
              No hay datos disponibles
            </Typography>
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );

  const setTableCard = () => (
    <Card
      sx={{
        width: "80%",
        overflow: "hidden",
        backgroundColor: "#f5f5f5",
        boxShadow: 5,
        textAlign: "center",
        borderRadius: "20px",
        minHeight: "250px",
        mt: 2,
      }}
    >
      <CardHeader
        title={
          <Typography fontWeight="bold" sx={{ fontFamily: "initial" }}>
            LISTA DE SOLICITUDES DE AMONESTACION
          </Typography>
        }
        avatar={<FormatListBulletedIcon />}
        sx={{
          background: "#0b2f6d",
          color: "white",
          textAlign: "end",
        }}
      />
      <TableContainer
        component={Paper}
        sx={{ width: "100%", height: "100%", overflow: "auto" }}
      >
        <Table stickyHeader>
          {setTableHead()}
          {setTableBody()}
        </Table>
      </TableContainer>
    </Card>
  );

  useEffect(() => {
    fetchOptions();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%",
        overflow: "auto",
        paddingTop: 8,
        paddingBottom: "50px",
      }}
    >
      {open && (
        <Alert
          onClose={handleClose}
          severity="info"
          sx={{ marginTop: "2%", width: "80%" }}
        >
          {message}
        </Alert>
      )}
      {statisticsCard()}
      {filterCard()}
      {createNew()}
      {downloadExcel()}
      {is_loading && !is_load ? (
        <Box
          sx={{
            width: "80%",
            overflow: "hidden",
            backgroundColor: "#f5f5f5",
            boxShadow: 5,
            borderRadius: "10px",
            mt: 2,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Skeleton
            variant="rounded"
            width={"90%"}
            height={"800px"}
            sx={{ p: 3, m: 3 }}
          />
        </Box>
      ) : (
        <>
          {setTableCard()}
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

export default Solicitudes;
