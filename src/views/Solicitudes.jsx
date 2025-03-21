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
} from "@mui/material";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSolicitudes, getFilteredSolicitudes } from "../api/solicitudAPI";
import { onLoad, onLoading, setMessage } from "../slices/solicitudSlice";
import filterData from "../data/filterSolicitud";

function Solicitudes() {
  const authState = useSelector((state) => state.auth);
  const solicitudState = useSelector((state) => state.solicitud);
  const { token } = authState;
  const { message, data, is_loading, is_load, pages } = solicitudState;
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [page, setPage] = useState(1);
  const [filterID, setFilterID] = useState(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => setOpen(false);

  const fetchData = async () => {
    try {
      dispatch(onLoading());
      setIsSubmitting(true);
      const res =
        filterID === undefined
          ? await getSolicitudes(token, page)
          : await getFilteredSolicitudes(token, filterID, page);
      dispatch(onLoad(res));
      setIsSubmitting(false);
    } catch (error) {
      dispatch(setMessage("Información no encontrada."));
      setOpen(true);
      setIsSubmitting(false);
    }
  };

  const handleClear = async (e) => {
    e.preventDefault();
    setFilterID(undefined);
  };

  const fetchOptions = () => {
    const transformedOptions = filterData.map((item) => ({
      value: item.solicitudEstadoID,
      label: item.descri,
    }));
    setOptions(transformedOptions);
  };

  const handlePage = (newPage) => setPage(newPage);

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
          width: "80%",
          overflow: "hidden",
          backgroundColor: "#f5f5f5",
          boxShadow: 5,
          textAlign: "center",
          borderRadius: "10px",
          mt: 2,
        }}
      >
        <CardHeader
          title={
            <Typography fontWeight="bold" sx={{ fontFamily: "initial" }}>
              FILTRAR SOLICITUDES SEGUN ESTADO
            </Typography>
          }
          avatar={<SearchIcon />}
          sx={{
            background: "#0b2f6d",
            color: "white",
            textAlign: "end",
          }}
        />
        <CardContent>
          <form>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <Select
                labelId="estado-label"
                required
                id="estado-select"
                value={filterID || ""}
                sx={{ minWidth: "200px", height: "40px" }}
                onChange={(event) => {
                  setFilterID(event.target.value);
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
      </Card>
    </>
  );

  const createNew = () => (
    <>
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
            }}
          >
            <AddCircleOutlineIcon /> Crear Nueva
          </Button>
        </Link>
      </Box>
    </>
  );

  const setTableHead = () => (
    <>
      <TableHead>
        <TableRow>
          {[
            "FECHA SOLICITUD",
            "N° FOLIO",
            "MOTIVO",
            "FORMULARIO",
            "SOLICITANTE",
            "AMONESTADO",
          ].map((header) => (
            <TableCell key={header} align="center">
              <Typography fontFamily="initial">{header}</Typography>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    </>
  );

  const setTableBody = () => (
    <>
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
              <TableCell
                align="center"
                sx={{ fontSize: "12px", minHeight: "70px" }}
              >
                {row.fechaSolicitud ? row.fechaSolicitud : "Sin Información"}
              </TableCell>
              <TableCell align="center" sx={{ fontSize: "12px" }}>
                {row.folio ? row.folio : "Sin Folio"}
              </TableCell>
              <TableCell align="center" sx={{ fontSize: "12px" }}>
                {row.motivo && row.motivo.descri
                  ? row.motivo.descri
                  : "Sin Información"}
              </TableCell>
              <TableCell align="center" sx={{ fontSize: "12px" }}>
                {row.area && row.area.descri
                  ? row.area.descri
                  : "Sin área asignada"}
              </TableCell>
              <TableCell align="center" sx={{ fontSize: "12px" }}>
                {row.solicitante && row.solicitante.nombre
                  ? row.solicitante.nombre
                  : "Sin Información"}
              </TableCell>
              <TableCell align="center" sx={{ fontSize: "12px" }}>
                {row.persona && row.persona.Nombre
                  ? row.persona.Nombre
                  : "Sin Información"}
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
    </>
  );

  const setTableCard = () => (
    <Card
      sx={{
        width: "80%",
        overflow: "hidden",
        backgroundColor: "#f5f5f5",
        boxShadow: 5,
        textAlign: "center",
        borderRadius: "10px",
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
    fetchData();
  }, [page]);

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
      {filterCard()}
      {createNew()}
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
