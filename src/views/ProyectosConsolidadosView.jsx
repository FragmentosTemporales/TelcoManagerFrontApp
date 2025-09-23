import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  MenuItem,
  Skeleton,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  InputLabel,
  FormControl,
  Paper,
  Divider,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getProyectosFiltradosCubicados
} from "../api/onnetAPI";
import { MainLayout } from "./Layout";
import { palette } from "../theme/palette";
import ModuleHeader from "../components/ModuleHeader";

function ProyectosOnNetView() {
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [alertType, setAlertType] = useState("info");
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [toFilter, setToFilter] = useState({
    proyecto: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const fetchData = async () => {
    setIsLoading(true);
    setIsSubmitting(true);
    try {
      const response = await getProyectosFiltradosCubicados(toFilter, page);
      setPages(response.pages);
      setData(response.data);
    } catch (error) {
      console.error(error);
      setAlertType("error");
      setMessage(error);
      setOpen(true);
    }
    setIsLoading(false);
    setIsSubmitting(false);
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
          bgcolor: palette.primary,
          fontWeight: 600,
          '&:hover': { bgcolor: palette.primaryDark },
        }}
      >
        <ArrowBackIosIcon />
      </Button>
      <Button
        key="current"
        variant="contained"
        sx={{
          bgcolor: palette.primary,
          fontWeight: 600,
          cursor: 'default',
          '&:hover': { bgcolor: palette.primary },
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
          bgcolor: palette.primary,
          fontWeight: 600,
          '&:hover': { bgcolor: palette.primaryDark },
        }}
      >
        <ArrowForwardIosIcon />
      </Button>
    </>
  );

  // Header array for the table
  const tableHeaders = [
    "PROYECTO",
    "BANDEJA",
    "CENTRAL FTTX",
    "AGENCIA",
    "DESPLIEGUE",
  ];

  const handleClear = async (e) => {
    e.preventDefault();
    try {
      setToFilter({ bandeja: "", categoria: "" });
      setPage(1); // Reset to the first page
      await getProyectosFiltradosCubicados(
        { bandeja: "", categoria: "" },
        1
      ).then((res) => {
        setPages(res.pages);
        setData(res.data);
      });
    } catch (error) {
      console.error(error);
      setMessage("Error al limpiar los filtros.");
      setOpen(true);
    }
  };


  const handleClose = () => {
    setOpen(false);
  };

  const filterCard = () => (
    <Paper
      elevation={8}
      sx={{
        width: "90%",
        mb: 2,
        mt: 3,
        pt: 3,
        pb: 3,
        borderRadius: 3,
        background: palette.cardBg,
        border: `1px solid ${palette.borderSubtle}`,
        backdropFilter: 'blur(4px)',
        position: 'relative',
        overflow: 'hidden',
        '&:before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 70%)',
          pointerEvents: 'none'
        }
      }}
    >
      <form>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-evenly',
              alignItems: 'center',
              gap: 3,
              width: '100%',
            }}
          >
            {[{
              label: 'Proyecto',
              value: toFilter.proyecto || '',
              onChange: (val) => setToFilter((p) => ({ ...p, proyecto: val }))
            }].map(cfg => (
              <FormControl key={cfg.label} sx={{ minWidth: 200 }}>
                <TextField
                  label={cfg.label}
                  variant="standard"
                  value={cfg.value}
                  size="small"
                  onChange={(e) => cfg.onChange(e.target.value)}
                />
              </FormControl>
            ))}
            <Button
              variant="contained"
              onClick={handleClear}
              sx={{
                fontWeight: 600,
                bgcolor: palette.primary,
                minWidth: 200,
                height: 42,
                letterSpacing: .6,
                boxShadow: '0 4px 12px -3px rgba(0,0,0,.35)',
                '&:hover': { bgcolor: palette.primaryDark },
              }}
            >
              LIMPIAR FILTROS
            </Button>
            <Button
              variant="outlined"
              onClick={fetchData}
              sx={{
                fontWeight: 600,
                minWidth: 200,
                height: 42,
                letterSpacing: .6,
                borderWidth: 2,
                borderColor: palette.primary,
                color: palette.primary,
                '&:hover': { borderColor: palette.accent, color: palette.accent, bgcolor: palette.accentSoft },
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Procesando...' : 'Actualizar'}
            </Button>
          </Box>
        </Box>
      </form>
    </Paper>
  );


  const setTable = () => (
    <TableContainer>
      <Table
        sx={{ width: "100%", display: "column", justifyContent: "center" }}
      >
        {setTableHead()}
        {setTableBody()}
      </Table>
    </TableContainer>
  );

  const setTableHead = () => (
    <>
      <TableHead>
        <TableRow>
          {tableHeaders.map((header) => (
            <TableCell
              key={header}
              align="center"
              sx={{
                background: palette.primary,
                fontWeight: "bold",
                color: "white",
                fontSize: "14px",
              }}
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
          backgroundColor: "#fff",
        }}
      >
        {data && data.length > 0 ? (
          data.map((row, index) => (
            <TableRow
              key={index}
              component={Link}
              to={`/modulo:proyecto-filtrado-cubicado/${row.proyecto}`}
              sx={{
                textDecoration: "none",
                cursor: "pointer",
                transition: 'background-color .25s',
                '&:hover': { backgroundColor: palette.accentSoft },
              }}
            >
              <TableCell align="center" sx={{ fontSize: "12px" }}>
                <Typography variant="secondary">
                  {row.proyecto ? row.proyecto : "Sin Información"}
                </Typography>
              </TableCell>

              <TableCell align="center" sx={{ fontSize: "12px" }}>
                <Typography variant="secondary">
                  {row.bandeja_onnet ? row.bandeja_onnet : "Sin Información"}
                </Typography>
              </TableCell>

              <TableCell align="center" sx={{ fontSize: "12px" }}>
                <Typography variant="secondary">
                  {row.central_fttx ? row.central_fttx : "Sin Información"}
                </Typography>
              </TableCell>

              <TableCell align="center" sx={{ fontSize: "12px" }}>
                <Typography variant="secondary">
                  {row.agencia ? row.agencia : "Sin Información"}
                </Typography>
              </TableCell>

              <TableCell align="center" sx={{ fontSize: "12px" }}>
                <Typography variant="secondary">
                  {row.despliegue ? row.despliegue : "Sin Información"}
                </Typography>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} align="center" sx={{ width: "100%" }}>
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
    window.scrollTo(0, 0);
  }, []);

  return (
    <MainLayout showNavbar={true}>
      <Box
        sx={{
          position: 'relative',
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          height: "100%",
          width: "100%",
          overflow: "auto",
          minHeight: "100vh",
          py: 10,
          px: { xs: 1.5, sm: 2 },
          background: palette.bgGradient,
          '::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 20% 25%, rgba(255,255,255,0.08), transparent 60%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.06), transparent 65%)',
            pointerEvents: 'none'
          }
        }}
      >
        {open && (
          <Alert
            onClose={handleClose}
            severity={alertType || "info"}
            sx={{ mt: 10, mb: 3, width: "90%" }}
          >
            {message || "Mensaje de alerta por defecto"}
          </Alert>
        )}

        <ModuleHeader
          title="Proyectos Cubicados Onnet"
          subtitle="Gestión de cubicados Onnet"
        />
        {filterCard()}
        <Box
          sx={{
            width: { lg: "90%", md: "90%", xs: "100%" },
            overflow: "hidden",
            textAlign: "center",
            borderRadius: 3,
            mt: 2,
          }}
        >
          {isLoading ? (
            <Skeleton
              variant="rectangular"
              animation="wave"
              sx={{
                width: "100%",
                height: "200px",
                borderRadius: "0px",
              }}
            />
          ) : (
            <Paper
              elevation={10}
              sx={{
                p: 2,
                background: palette.cardBg,
                border: `1px solid ${palette.borderSubtle}`,
                borderRadius: 3,
                backdropFilter: 'blur(6px)',
                position: 'relative',
                overflow: 'hidden',
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 60%)',
                  pointerEvents: 'none'
                }
              }}
            >
              {setTable()}
            </Paper>
          )}
        </Box>

        <ButtonGroup
          size="small"
          aria-label="pagination-button-group"
          sx={{ p: 2 }}
        >
          {getButtons()}
        </ButtonGroup>
      </Box>
    </MainLayout>
  );
}

export default ProyectosOnNetView;
