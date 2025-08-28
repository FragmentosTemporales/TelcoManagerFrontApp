import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Divider,
  Chip,
} from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  getDataMigracionesProactivas,
  getMigracionesExcel,
} from "../api/despachoAPI";
import extractDate, { extractDateOnly } from "../helpers/main";
import { MainLayout } from "./Layout";
import { palette } from "../theme/palette";
import ModuleHeader from "../components/ModuleHeader";

function MigracionesViewer() {
  const authState = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [message, setMessage] = useState("");
  const [data, setData] = useState([]);
  const [statsData, setStatsData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [total, setTotal] = useState(0);
  const [is_loading, setIsLoading] = useState(true);

  const handleClose = () => setOpen(false);

  const fetchData = async () => {
    try {
  const response = await getDataMigracionesProactivas(page);
      setData(response.data);
      setPages(response.pages);
      setTotal(response.total);
      setStatsData(response.stats || []);
    } catch (error) {
      console.log(error);
      setMessage(error.error || "Error al cargar los datos");
      setOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData();
  }, [page]);

  const getExcel = async () => {
    setIsSubmitting(true);
    try {
  await getMigracionesExcel();
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePage = (newPage) => setPage(newPage);

  const getButtons = () => (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Button
        key="prev"
        variant="contained"
        onClick={() => handlePage(page - 1)}
        disabled={page === 1}
        sx={{ background: "#142a3d" }}
      >
        <ArrowBackIosIcon />
      </Button>
      <Button key="current" variant="contained" sx={{ background: "#142a3d" }}>
        {page}
      </Button>
      <Button
        key="next"
        variant="contained"
        onClick={() => handlePage(page + 1)}
        disabled={page === pages}
        sx={{ background: "#142a3d" }}
      >
        <ArrowForwardIosIcon />
      </Button>
    </Box>
  );

  const setTableHead = () => (
    <TableHead>
      <TableRow>
        {[
          "ID VIVIENDA",
          "CREACION",
          "CONTACTO",
          "INGRESO",
          "FECHA AGENDA",
          "USUARIO",
        ].map((header) => (
          <TableCell
            key={header}
            align="center"
            sx={{
              fontWeight: 600,
              backgroundColor: palette.primary,
              color: "white",
              borderBottom: `2px solid ${palette.primaryDark}`,
              letterSpacing: 0.4,
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
            sx={{
              '&:last-child td, &:last-child th': { border: 0 },
              transition: "background-color .25s",
              backgroundColor: index % 2 === 0 ? 'rgba(255,255,255,0.04)' : 'transparent',
              '&:hover': { backgroundColor: palette.accentSoft },
            }}
          >
            <TableCell align="center" sx={{ fontSize: "12px" }}>
              {row.id_vivienda ? row.id_vivienda : "Sin ID"}
            </TableCell>
            <TableCell align="center" sx={{ fontSize: "12px" }}>
              {row.fecha_registro
                ? extractDate(row.fecha_registro)
                : "Sin Fecha"}
            </TableCell>
            <TableCell align="center" sx={{ fontSize: "12px" }}>
              {row.contacto ? row.contacto : "Sin Contacto"}
            </TableCell>
            <TableCell align="center" sx={{ fontSize: "12px" }}>
              {row.ingreso ? row.ingreso : "Sin Ingreso"}
            </TableCell>
            <TableCell align="center" sx={{ fontSize: "12px" }}>
              {row.fecha_agenda ? row.fecha_agenda : "Sin Fecha Agenda"}
            </TableCell>
            <TableCell align="center" sx={{ fontSize: "12px" }}>
              {row.usuario.nombre ? row.usuario.nombre : "Sin Usuario"}
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
    <TableContainer
      component={Paper}
      elevation={10}
      sx={{
        width: "90%",
        height: "100%",
        overflow: "auto",
        marginTop: 2,
        borderRadius: 3,
        background: palette.cardBg,
        border: `1px solid ${palette.borderSubtle}`,
        backdropFilter: "blur(4px)",
        boxShadow:
          "0 10px 28px -10px rgba(0,0,0,0.38), 0 6px 12px -4px rgba(0,0,0,0.24)",
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
            padding: 1,
            fontStyle: "italic",
            fontSize: "12px",
            fontWeight: 500,
          }}
          align="left"
        >
          Total de Migraciones: {total}
        </Typography>
        <Typography
          sx={{
            color: "white",
            padding: 1,
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

  const statsChart = () => (
    <Box
      sx={{
        width: "90%",
        background: palette.cardBg,
        borderRadius: 3,
        border: `1px solid ${palette.borderSubtle}`,
        backdropFilter: "blur(4px)",
        m: 2,
        boxShadow:
          "0 10px 28px -10px rgba(0,0,0,0.34), 0 6px 12px -4px rgba(0,0,0,0.20)",
      }}
    >

      <LineChart
        grid={{ vertical: true, horizontal: true }}
        xAxis={[
          {
            data: statsData.map((item) => extractDateOnly(item.fecha)),
            scaleType: "point",
          },
        ]}
        series={[
          {
            data: statsData.map((item) => parseInt(item.q)),
            label: "Cantidad de Migraciones",
            color: palette.primary,
          },
        ]}
        height={250}
        margin={{ left: 50, right: 40, top: 40, bottom: 50 }}
      />
    </Box>
  );

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
          pt: { xs: 9, md: 10 },
          pb: 8,
          background: palette.bgGradient,
          position: "relative",
          '::before': {
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
          title="Migraciones Proactivas"
          subtitle="Seguimiento y análisis de migraciones proactivas"
          divider
        />

        {is_loading ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minHeight: "70vh",
              width: "100%",
            }}
          >
            <Skeleton sx={{ width: "90%", height: "200px" }} />
            <Skeleton sx={{ width: "90%", height: "100px" }} />
            <Skeleton sx={{ width: "90%", height: "450px" }} />
          </Box>
        ) : (
          <>
            {statsChart()}
            <Box sx={{ display: "flex", alignContent: "start", width: "90%" }}>
              <Button
                disabled={isSubmitting}
                onClick={getExcel}
                variant="contained"
                sx={{
                  width: "200px",
                  background: `linear-gradient(135deg, ${palette.accent} 0%, #43baf5 50%, ${palette.accent} 100%)`,
                  color: '#fff',
                  transition: 'all .35s',
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(160deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 55%)',
                    mixBlendMode: 'overlay',
                    pointerEvents: 'none'
                  },
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 14px 28px -6px rgba(0,0,0,0.55), 0 4px 12px -2px rgba(0,0,0,0.45)',
                    background: `linear-gradient(135deg, #43baf5 0%, ${palette.accent} 55%, #1d88c0 100%)`
                  },
                  '&:active': { transform: 'translateY(-1px)', boxShadow: '0 8px 18px -6px rgba(0,0,0,0.55)' },
                  '&:focus-visible': { outline: '2px solid #ffffff', outlineOffset: 2 }
                }}
              >
                {isSubmitting ? "Descargando..." : "Descargar"}
              </Button>
            </Box>
            {setTableCard()}
            <ButtonGroup
              size="small"
              aria-label="pagination-button-group"
              sx={{ p: 2, '& .MuiButton-root': { borderColor: palette.primaryDark } }}
            >
              {getButtons()}
            </ButtonGroup>
          </>
        )}
      </Box>
    </MainLayout>
  );
}

export default MigracionesViewer;
