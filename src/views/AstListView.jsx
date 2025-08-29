import {
  Autocomplete,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
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
import BarChartIcon from "@mui/icons-material/BarChart";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useState, useEffect } from "react";
import {
  getAstList,
  getNotAstCC,
  getDataCCStats,
  getAstHistoricoExcel,
  getAstUsers,
} from "../api/prevencionAPI";
import { Link } from "react-router-dom";
import { MainLayout } from "./Layout";
import palette from "../theme/palette";
import ModuleHeader from "../components/ModuleHeader";

function FormAstList() {
  const [data, setData] = useState(undefined);
  const [dataUsers, setDataUsers] = useState(undefined);
  const [dataStatsCC, setDataStatsCC] = useState(undefined);
  const [dataStatsCCFiltered, setDataStatsCCFiltered] = useState(undefined);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showStats, setShowStats] = useState(false);
  const handlePage = (newPage) => setPage(newPage);
  const [centroCosto, setCentroCosto] = useState({ centro: "VTR RM" });
  const [form, setForm] = useState({ fecha: "", numDoc: "" });
  const [selectedUser, setSelectedUser] = useState(null); // Nuevo estado para Autocomplete

  const extractDate = (gmtString) => {
    const date = new Date(gmtString);

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");

    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const seconds = String(date.getUTCSeconds()).padStart(2, "0");

    const formattedDateTime = `${hours}:${minutes}:${seconds} ${day}-${month}-${year} `;

    return formattedDateTime;
  };

  const fetchData = async () => {
    try {
      setIsSubmitting(true);
      setIsLoading(true);
  const res = await getAstList(page, form);
      setData(res.data);
      setPages(res.pages);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
      window.scrollTo(0, 0); // Scroll to top after fetching data
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  const handleClear = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSubmitting(true);
    try {
      setForm({ fecha: "", numDoc: "" });
      setSelectedUser(null); // Limpiar Autocomplete
      setPage(1); // Reset to the first page
  await getAstList(1, { fecha: "", numDoc: "" }).then((res) => {
        setData(res.data);
        setPages(res.pages);
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  const fetchDataAstByCC = async () => {
    try {
  const res = await getDataCCStats(centroCosto);
      setDataStatsCCFiltered(res);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataUsers = async () => {
    try {
  const res = await getAstUsers();
      setDataUsers(res);
    } catch (error) {
      console.log(error);
    }
  };

  const setTableCard = () => (
    <TableContainer
      sx={{
        width: "90%",
        height: "100%",
        overflow: "auto",
        mt: 2,
        borderRadius: 3,
        border: `1px solid ${palette.borderSubtle}`,
        background: palette.cardBg,
        backdropFilter: "blur(8px)",
        boxShadow: "0 6px 24px rgba(0,0,0,0.15)",
      }}
    >
      <Table stickyHeader>
        {setTableHead()}
        {setTableBody()}
      </Table>
    </TableContainer>
  );

  const fetchNotAstCC = async () => {
    try {
  const res = await getNotAstCC();
      setDataStatsCC(res);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleStats = () => {
    setShowStats((prev) => !prev);
  };

  const getExcel = async () => {
    setIsSubmitting(true);
    try {
  await getAstHistoricoExcel();
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const gradientBtn = {
    background: `linear-gradient(135deg, ${palette.accent} 0%, ${palette.primary} 95%)`,
    color: "#fff",
    fontWeight: 600,
    letterSpacing: 0.4,
    textTransform: "none",
    boxShadow: "0 4px 14px -4px rgba(0,0,0,0.4)",
    "&:hover": {
      background: `linear-gradient(135deg, ${palette.primaryDark} 0%, ${palette.primary} 90%)`,
      boxShadow: "0 6px 22px -4px rgba(0,0,0,0.55)",
    },
    "&:disabled": { background: palette.primaryDark, opacity: 0.5 },
  };

  const subtleBtn = {
    border: `1px solid ${palette.borderSubtle}`,
    color: palette.primary,
    fontWeight: 600,
    textTransform: "none",
    background: "rgba(255,255,255,0.6)",
    backdropFilter: "blur(6px)",
    "&:hover": {
      borderColor: palette.accent,
      background: "rgba(255,255,255,0.85)",
    },
  };

  const downloadExcel = () => (
    <Box
      sx={{
        width: "90%",
        mb: 2,
        mt: 2,
        display: "flex",
        justifyContent: "start",
      }}
    >
      <Button
        onClick={getExcel}
        disabled={isSubmitting}
        sx={{ ...gradientBtn, width: 260, height: 44, borderRadius: 2 }}
      >
        {isSubmitting ? "Procesando..." : "Descargar Excel"}
      </Button>
    </Box>
  );

  const getButtons = () => (
    <>
      <Button
        key="prev"
        onClick={() => handlePage(page - 1)}
        disabled={page === 1}
        sx={subtleBtn}
      >
        <ArrowBackIosIcon fontSize="small" />
      </Button>
      <Button key="current" disabled sx={{ ...subtleBtn, fontWeight: 700 }}>
        {page}
      </Button>
      <Button
        key="next"
        onClick={() => handlePage(page + 1)}
        disabled={page === pages}
        sx={subtleBtn}
      >
        <ArrowForwardIosIcon fontSize="small" />
      </Button>
    </>
  );

  const filterCard = () => (
    <Box
      sx={{
        width: "90%",
        overflow: "hidden",
        background: palette.cardBg,
        border: `1px solid ${palette.borderSubtle}`,
        borderRadius: 3,
        textAlign: "center",
        mt: 2,
        py: 3,
        backdropFilter: "blur(8px)",
        boxShadow: "0 6px 24px rgba(0,0,0,0.15)",
      }}
    >
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Autocomplete
            variant="standard"
            options={dataUsers || []}
            getOptionLabel={(option) => option.label || ""}
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            value={selectedUser}
            onChange={(event, value) => {
              setSelectedUser(value);
              setForm((prev) => ({
                ...prev,
                numDoc: value ? value.value : "",
              }));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Seleccionar Usuario"
                variant="standard"
                size="small"
              />
            )}
            sx={{ width: { xs: "100%", sm: "45%", md: "30%" } }}
          />
          <TextField
            label="Fecha"
            type="date"
            variant="standard"
            size="small"
            InputLabelProps={{ shrink: true }}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, fecha: e.target.value }))
            }
            sx={{ width: { xs: "100%", sm: "45%", md: "30%" } }}
            value={form.fecha}
          />
        </Box>
        <Box
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Button
            type="submit"
            disabled={isSubmitting}
            sx={{ ...gradientBtn, width: 200, borderRadius: 2 }}
          >
            {isSubmitting ? "Procesando..." : "Filtrar"}
          </Button>
          <Button
            disabled={isSubmitting}
            onClick={handleClear}
            sx={{ ...subtleBtn, width: 200, borderRadius: 2 }}
          >
            {isSubmitting ? "Procesando..." : "Limpiar Filtros"}
          </Button>
        </Box>
      </form>
    </Box>
  );

  const statsCard = () => (
    <Card
      sx={{
        width: "90%",
        overflow: "hidden",
        background: palette.cardBg,
        textAlign: "center",
        borderRadius: 3,
        mt: 2,
        mb: 2,
        border: `1px solid ${palette.borderSubtle}`,
        backdropFilter: "blur(8px)",
        boxShadow: "0 6px 24px rgba(0,0,0,0.18)",
      }}
    >
      <CardHeader
        title={
          <Typography fontWeight={700} sx={{ letterSpacing: 0.5 }}>
            DATOS NO REALIZADAS
          </Typography>
        }
        avatar={<BarChartIcon sx={{ color: palette.accent }} />}
        action={
          <Button
            onClick={toggleStats}
            sx={{ ...subtleBtn, minWidth: 44, height: 36, borderRadius: 2 }}
          >
            {showStats ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </Button>
        }
        sx={{
          background: `linear-gradient(120deg, ${palette.primaryDark} 0%, ${palette.primary} 70%)`,
          color: "white",
          textAlign: "end",
          "& .MuiCardHeader-action": { alignSelf: "center" },
        }}
      />
      {showStats && dataStatsCC && (
        <CardContent>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {setTableStatsCC()}
            {setTableStatsCCFilteres()}
          </Box>
        </CardContent>
      )}
    </Card>
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
                background: `linear-gradient(120deg, ${palette.primaryDark} 0%, ${palette.primary} 70%)`,
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
                background: `linear-gradient(120deg, ${palette.primaryDark} 0%, ${palette.primary} 70%)`,
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
                <Typography variant="secondary">
                  {row.Q ? row.Q : "Sin Información"}
                </Typography>
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontSize: "10px", width: "10%" }} // Equal width
              >
                <Typography variant="secondary">
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
                <Typography variant="secondary">
                  {row.nombre ? row.nombre : "Sin Información"}
                </Typography>
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontSize: "10px", width: "10%" }} // Equal width
              >
                <Typography variant="secondary">
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
                background: `linear-gradient(120deg, ${palette.primaryDark} 0%, ${palette.primary} 80%)`,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: "#fff",
                  fontSize: "14px",
                }}
              >
                {header.label}
              </Typography>
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
                backgroundColor: "#ffffffcc",
                backdropFilter: "blur(4px)",
                "&:hover": {
                  backgroundColor: "#ffffff",
                  transition: "background-color .25s",
                },
              }}
              key={index}
            >
              <TableCell align="center" sx={{ fontSize: "12px", width: "25%" }}>
                <Typography variant="secondary">
                  {row.fechaForm
                    ? extractDate(row.fechaForm)
                    : "Sin Información"}
                </Typography>
              </TableCell>
              <TableCell align="center" sx={{ fontSize: "12px", width: "25%" }}>
                <Typography variant="secondary">
                  {row.nombre ? row.nombre : "Sin Información"}
                </Typography>
              </TableCell>
              <TableCell align="center" sx={{ fontSize: "12px", width: "25%" }}>
                <Typography variant="secondary">
                  {row.numDoc ? row.numDoc : "Sin Información"}
                </Typography>
              </TableCell>
              <TableCell align="center" sx={{ fontSize: "12px", width: "25%" }}>
                <Typography variant="secondary">
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
    fetchDataUsers();
  }, []);

  useEffect(() => {
    fetchDataAstByCC();
  }, [centroCosto]);

  return (
    <MainLayout showNavbar={true}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          width: "100%",
          minHeight: "100vh",
          py: 8,
          position: "relative",
          overflow: "auto",
          background: palette.bgGradient,
          "::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 20% 18%, rgba(255,255,255,0.085), transparent 60%), radial-gradient(circle at 78% 75%, rgba(255,255,255,0.06), transparent 65%)",
            pointerEvents: "none",
          },
        }}
      >
        <ModuleHeader
          title="Formularios AST"
          subtitle="Listado, filtros y estadísticas de AST"
          divider
        />
        {statsCard()}
        {filterCard()}
        {downloadExcel()}
        {isLoading ? (
          <Box
            sx={{
              width: "100%",
              minHeight: "60vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Skeleton variant="rounded" width={"90%"} height={"100%"} />
          </Box>
        ) : (
          <>
            {setTableCard()}
            <ButtonGroup
              size="small"
              aria-label="pagination-button-group"
              sx={{ p: 2, gap: 1 }}
            >
              {getButtons()}
            </ButtonGroup>
          </>
        )}
      </Box>
    </MainLayout>
  );
}

export default FormAstList;
