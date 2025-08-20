import {
  Alert,
  Box,
  Button,
  ButtonGroup,
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
  TextField,
  Divider,
  Chip,
} from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getSolicitudesFiltradas,
  getSolicitudesExcel,
} from "../api/solicitudAPI";
import { onLoad, onLoading, setMessage } from "../slices/solicitudSlice";
import filterData from "../data/filterSolicitud";
import { MainLayout } from "./Layout";
import { palette } from "../theme/palette";
import ModuleHeader from "../components/ModuleHeader";

function Solicitudes() {
  const authState = useSelector((state) => state.auth);
  const solicitudState = useSelector((state) => state.solicitud);
  const { token } = authState;
  const { message, data, is_loading, is_load, pages, total } = solicitudState;
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [page, setPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      await getSolicitudesFiltradas(token, { folio: "", estado: "" }, 1).then(
        (res) => {
          dispatch(onLoad(res));
        }
      );
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
    setIsSubmitting(true);
    try {
      await getSolicitudesExcel(token);
    } catch (error) {
      console.log(error);
    }
    finally {
      setIsSubmitting(false);
    }
  };

  const handlePage = (newPage) => setPage(newPage);

  const getButtons = () => (
    <>
      <Button
        key="prev"
        variant="contained"
        onClick={() => handlePage(page - 1)}
        disabled={page === 1}
        sx={{
          background: `linear-gradient(140deg, ${palette.primary} 0%, ${palette.primaryDark} 100%)`,
          boxShadow: "0 3px 10px -2px rgba(10,27,43,0.5)",
          "&:hover": { background: palette.primaryDark },
          "&:disabled": { opacity: 0.5 },
        }}
      >
        <ArrowBackIosIcon />
      </Button>
      <Button
        key="current"
        variant="contained"
        sx={{
          background: palette.accent,
          color: "#fff",
          fontWeight: 600,
          "&:hover": { background: palette.accent },
        }}
      >
        {page}
      </Button>
      <Button
        key="next"
        variant="contained"
        onClick={() => handlePage(page + 1)}
        disabled={page === pages}
        sx={{
          background: `linear-gradient(140deg, ${palette.primary} 0%, ${palette.primaryDark} 100%)`,
          boxShadow: "0 3px 10px -2px rgba(10,27,43,0.5)",
          "&:hover": { background: palette.primaryDark },
          "&:disabled": { opacity: 0.5 },
        }}
      >
        <ArrowForwardIosIcon />
      </Button>
    </>
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const filterCard = () => (
    <Paper
      elevation={10}
      sx={{
        width: "90%",
        mt: 3,
        py: 4,
        textAlign: "center",
        background: palette.cardBg,
        border: `1px solid ${palette.borderSubtle}`,
        borderRadius: 3,
        backdropFilter: "blur(6px)",
        boxShadow: "0 10px 28px -10px rgba(0,0,0,0.34), 0 6px 12px -4px rgba(0,0,0,0.20)",
      }}
    >

      <form>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 3,
          }}
        >
          <TextField
            id="folio-input"
            label="Folio"
            variant="standard"
            value={toFilter.folio || ""}
            onChange={(event) => {
              setToFilter((prev) => ({
                ...prev,
                folio: event.target.value,
              }));
            }}
            sx={{ minWidth: 200 }}
            size="small"
          />
          <Select
            labelId="estado-label"
            required
            variant="standard"
            id="estado-select"
            value={toFilter.estado || ""}
            sx={{ minWidth: 220 }}
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
            variant="outlined"
            onClick={fetchData}
            sx={{
              fontWeight: 600,
              minWidth: 200,
              height: 40,
              borderRadius: 2,
              borderColor: palette.accent,
              color: palette.accent,
              "&:hover": { borderColor: palette.accent, background: "rgba(255,255,255,0.08)" },
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Procesando..." : "Actualizar"}
          </Button>
          <Button
            variant="contained"
            onClick={handleClear}
            sx={{
              fontWeight: 600,
              background: `linear-gradient(140deg, ${palette.primary} 0%, ${palette.primaryDark} 100%)`,
              minWidth: 200,
              height: 40,
              borderRadius: 2,
              boxShadow:
                "0 6px 16px -4px rgba(10,27,43,0.55), 0 2px 6px -2px rgba(10,27,43,0.35)",
              "&:hover": { background: palette.primaryDark },
            }}
          >
            LIMPIAR FILTROS
          </Button>
        </Box>
      </form>
    </Paper>
  );

  const createNew = () => (
    <Box
      sx={{
        width: "90%",
        mt: 3,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 2,
      }}
    >
      <Link style={{ color: "white", textDecoration: "none" }} to="/create">
        <Button
          variant="contained"
          sx={{
            width: 220,
            height: 44,
            fontWeight: 600,
            display: "flex",
            justifyContent: "space-around",
            borderRadius: 2,
            letterSpacing: 0.4,
            background: `linear-gradient(135deg, ${palette.accent} 0%, ${palette.primary} 100%)`,
            boxShadow:
              "0 6px 16px -4px rgba(10,27,43,0.55), 0 2px 6px -2px rgba(10,27,43,0.35)",
            "&:hover": { background: palette.primaryDark },
          }}
        >
          <AddCircleOutlineIcon /> Crear Nueva
        </Button>
      </Link>
      <Button
        variant="contained"
        disabled={isSubmitting}
        onClick={getExcel}
        sx={{
          width: 220,
          height: 44,
          fontWeight: 600,
          letterSpacing: 0.4,
          display: "flex",
          justifyContent: "space-around",
          borderRadius: 2,
          background: `linear-gradient(145deg, ${palette.accent} 0%, ${palette.primaryDark} 100%)`,
          boxShadow:
            "0 6px 16px -4px rgba(10,27,43,0.55), 0 2px 6px -2px rgba(10,27,43,0.35)",
          "&:hover": { background: palette.primaryDark },
          "&:disabled": { opacity: 0.6 },
        }}
      >
        <InsertDriveFileIcon /> {isSubmitting ? "Descargando..." : "Descargar"}
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
          <TableCell
            key={header}
            align="center"
            sx={{
              fontWeight: 600,
              backgroundColor: palette.primary,
              color: "white",
              letterSpacing: 0.4,
              borderBottom: `2px solid ${palette.primaryDark}`,
            }}
          >
            <Typography>{header}</Typography>
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
              transition: "background-color .25s",
              backgroundColor: index % 2 === 0 ? "rgba(255,255,255,0.04)" : "transparent",
              "&:hover": { backgroundColor: palette.accentSoft },
            }}
          >
            <TableCell align="center" sx={{ fontSize: "12px" }}>{row.Folio ? row.Folio : "Sin Folio"}</TableCell>
            <TableCell align="center" sx={{ fontSize: "12px" }}>{row.Motivo ? row.Motivo : "Sin Información"}</TableCell>
            <TableCell align="center" sx={{ fontSize: "12px" }}>{row.Formulario ? row.Formulario : "Sin área asignada"}</TableCell>
            <TableCell align="center" sx={{ fontSize: "12px" }}>{row.Solicitante ? row.Solicitante : "Sin Información"}</TableCell>
            <TableCell align="center" sx={{ fontSize: "12px" }}>{row.Amonestado ? row.Amonestado : "Sin Información"}</TableCell>
            <TableCell align="center" sx={{ fontSize: "12px" }}>{row.Estado ? row.Estado : "Sin Información"}</TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={12} align="center">
            <Typography fontFamily="initial">No hay datos disponibles</Typography>
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );

  const setTableCard = () => (
    <TableContainer
      component={Paper}
      elevation={10}
      sx={{
        width: "90%",
        height: "100%",
        overflow: "auto",
        mt: 3,
        borderRadius: 3,
        background: palette.cardBg,
        border: `1px solid ${palette.borderSubtle}`,
        backdropFilter: "blur(4px)",
        boxShadow: "0 10px 28px -10px rgba(0,0,0,0.38), 0 6px 12px -4px rgba(0,0,0,0.24)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          p: 1,
          background: `linear-gradient(140deg, ${palette.primary} 0%, ${palette.primaryDark} 100%)`,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
      >
        <Typography
          sx={{
            color: "white",
            p: 1,
            fontStyle: "italic",
            fontSize: "12px",
            fontWeight: 500,
          }}
          align="left"
        >
          Total de Solicitudes: {total}
        </Typography>
        <Typography
          sx={{
            color: "white",
            p: 1,
            fontStyle: "italic",
            fontSize: "12px",
            fontWeight: 500,
          }}
          align="right"
        >
          Total de Páginas: {pages}
        </Typography>
      </Box>
      <Table stickyHeader>
        {setTableHead()}
        {setTableBody()}
      </Table>
    </TableContainer>
  );

  useEffect(() => {
    fetchOptions();
  }, []);

  return (
    <MainLayout showNavbar={true}>
      <Box
        sx={{
          display: "flex",
            flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          minHeight: "100vh",
          height: "100%",
          width: "100%",
          overflow: "auto",
          pt: { xs: 10, md: 11 },
          pb: 8,
          background: palette.bgGradient,
          position: "relative",
          "::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 20% 25%, rgba(255,255,255,0.08), transparent 60%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.06), transparent 65%)",
            pointerEvents: "none",
          },
        }}
      >
        {open && (
          <Alert
            onClose={handleClose}
            severity="info"
            sx={{
              width: "88%",
              boxShadow: 4,
              borderRadius: 3,
              background: palette.cardBg,
              border: `1px solid ${palette.borderSubtle}`,
            }}
          >
            {message}
          </Alert>
        )}
        <ModuleHeader
          title="Solicitudes"
          subtitle="Gestión y seguimiento de solicitudes de amonestación"
          divider
        />
        {filterCard()}
        {createNew()}
        {is_loading && !is_load ? (
          <Paper
            elevation={8}
            sx={{
              width: "90%",
              overflow: "hidden",
              background: palette.cardBg,
              border: `1px solid ${palette.borderSubtle}`,
              borderRadius: 3,
              mt: 3,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "30vh",
              backdropFilter: "blur(4px)",
            }}
          >
            <Skeleton sx={{ width: "90%", height: "100%" }} />
          </Paper>
        ) : (
          <>
            {setTableCard()}
            <ButtonGroup
              size="small"
              aria-label="pagination-button-group"
              sx={{ p: 2, "& .MuiButton-root": { borderColor: palette.primaryDark } }}
            >
              {getButtons()}
            </ButtonGroup>
          </>
        )}
      </Box>
    </MainLayout>
  );
}

export default Solicitudes;
