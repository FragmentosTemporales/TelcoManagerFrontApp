import {
  Box,
  Button,
  Divider,
  FormControl,
  LinearProgress,
  MenuItem,
  Modal,
  InputLabel,
  Select,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  TableHead,
  TextField,
  Typography,
} from "@mui/material";
import { getObjetivos, updateObjetivo } from "../api/dataAPI";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { MainLayout } from "./Layout";
import palette from "../theme/palette";

function ObjetivosView() {
  const authState = useSelector((state) => state.auth);
  const { user_id } = authState;
  const [gerencia, setGerencia] = useState(null);
  const [mes, setMes] = useState(null);
  const [data, setData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [id, setID] = useState(undefined);
  const [value, setValue] = useState(undefined);
  const [openModal, setOpenModal] = useState(false);
  const [habilitado, setHabilitado] = useState(false);
  const [error, setError] = useState(null);

  // UI style helpers
  const panelPaperSx = {
    width: "100%",
    mt: 2,
    p: 2,
    borderRadius: 2,
    border: `1px solid ${palette.borderSubtle}`,
    background: "rgba(255,255,255,0.92)",
    backdropFilter: "blur(8px)",
    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
    position: "relative"
  };
  const headerCellSx = {
    background: `linear-gradient(120deg, ${palette.primaryDark} 0%, ${palette.primary} 85%)`,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: ".5px",
    fontSize: 13,
    borderRight: `1px solid ${palette.primaryDark}`,
    '&:last-of-type': { borderRight: 'none' }
  };
  const bodyCellSx = { fontSize: 14, py: 1.2 };
  const editableRowSx = {
    cursor: "pointer",
    transition: "background .25s, transform .25s",
    '&:hover': { backgroundColor: "rgba(45,155,211,0.08)", transform: 'translateY(-2px)' }
  };

  const mesOptions = [
    {
      value: "2025-07-01",
      label: "Julio 2025",
    },
    {
      value: "2025-08-01",
      label: "Agosto 2025",
    },
    {
      value: "2025-09-01",
      label: "Septiembre 2025",
    },
    {
      value: "2025-10-01",
      label: "Octubre 2025",
    },
    {
      value: "2025-11-01",
      label: "Noviembre 2025",
    },
    {
      value: "2025-12-01",
      label: "Diciembre 2025",
    },
  ];

  const [origenes, setOrigenes] = useState([]);

  const gerenciaOptions = [
    {
      value: "Biobío",
      label: "Biobío",
    },
    {
      value: "Metropolitana",
      label: "Metropolitana",
    },
  ];

  const fetchData = async () => {
  if (!gerencia || !mes) return;
    try {
      setError(null);
      setIsSubmitting(true);
  const res = await getObjetivos(gerencia, mes);
      setData(res || []);
    } catch (err) {
      console.log(err);
      setError("Error al obtener datos. Intente nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  const ActualizarObjetivo = async () => {
    if (!id) return;
    const numericValue = parseInt(value, 10);
    if (isNaN(numericValue) || numericValue < 0) return;
    try {
      setIsSubmitting(true);
  await updateObjetivo(id, { value: numericValue });
      await fetchData();
      setOpenModal(false);
      setValue(undefined);
    } catch (err) {
      console.log(err);
      setError("Error al actualizar el objetivo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const setFilter = () => (
    <Box sx={panelPaperSx}>
      {isSubmitting && (
        <LinearProgress sx={{ position: 'absolute', left: 0, right: 0, top: 0, borderTopLeftRadius: 8, borderTopRightRadius: 8 }} />
      )}
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            padding: 3,
            flexWrap: 'wrap',
            gap: 2
          }}
        >
          <FormControl sx={{ minWidth: "350px" }}>
            <InputLabel id="chart-select-label">
              Seleccionar Gerencia
            </InputLabel>
            <Select
              required
              size="small"
              variant="standard"
              disabled={habilitado}
              labelId="estado-label"
              id="estado-select"
              value={gerencia || ""}
              sx={{ minWidth: "200px" }}
              onChange={(event) => {
                setGerencia(event.target.value);
              }}
            >
              {gerenciaOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: "350px" }}>
            <InputLabel id="chart-select-label">Seleccionar Mes</InputLabel>
            <Select
              labelId="estado-label"
              required
              size="small"
              variant="standard"
              id="estado-select"
              value={mes || ""}
              sx={{ minWidth: "200px" }}
              onChange={(event) => {
                setMes(event.target.value);
              }}
            >
              {mesOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            sx={{
              fontWeight: "bold",
              background: `linear-gradient(90deg, ${palette.primaryDark} 0%, ${palette.primary} 60%)`,
              minWidth: "200px",
              height: "40px",
              boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
              '&:hover': { background: `linear-gradient(90deg, ${palette.primaryDark} 0%, ${palette.primaryDark} 100%)` }
            }}
            disabled={isSubmitting || !gerencia || !mes}
          >
            {isSubmitting ? "Procesando..." : "Buscar"}
          </Button>
        </Box>
      </form>
    </Box>
  );

  const setTable = () => (
    <Box sx={panelPaperSx}>
      <TableContainer sx={{ maxHeight: 560 }}>
        <Table stickyHeader size="small">
          {setTableHead()}
          {setTableBody()}
        </Table>
      </TableContainer>
    </Box>
  );

  const setTableHead = () => (
    <>
      <TableHead>
        <TableRow>
          {[
            "GERENCIA",
            "SECTOR",
            "ORIGEN",
            "FUENTE",
            "TIPO",
            "FACILIDADES"
          ].map((header) => (
            <TableCell
              key={header}
              align="center"
              sx={headerCellSx}
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
            <TableRow
              key={index}
              onClick={row.editable ? () => {
                setID(row.id);
                setValue(row.facilidades ?? 0);
                setOpenModal(true);
              } : undefined}
              sx={{
                textDecoration: "none",
                backgroundColor: index % 2 === 0 ? 'rgba(255,255,255,0.6)' : 'rgba(240,245,250,0.6)',
                ...(row.editable ? editableRowSx : {}),
              }}
            >
              <TableCell align="center" sx={bodyCellSx}>
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.gerencia ? row.gerencia : "Sin Información"}
                </Typography>
              </TableCell>
              <TableCell align="center" sx={bodyCellSx}>
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.sector ? row.sector : "Sin Información"}
                </Typography>
              </TableCell>
              <TableCell align="center" sx={bodyCellSx}>
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.origen ? row.origen : "Sin Información"}
                </Typography>
              </TableCell>
              <TableCell align="center" sx={bodyCellSx}>
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.fuente ? row.fuente : "Sin Información"}
                </Typography>
              </TableCell>
              <TableCell align="center" sx={bodyCellSx}>
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.tipo ? row.tipo : "Sin Información"}
                </Typography>
              </TableCell>
              <TableCell align="center" sx={bodyCellSx}>
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.facilidades ? row.facilidades : 0}
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

  const setModal = () => (
    <>
      <Modal open={openModal} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: '90%', sm: '500px' },
            bgcolor: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
            p: 4,
            borderRadius: 3,
            border: `1px solid ${palette.borderSubtle}`
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            fontFamily={"initial"}
            sx={{ pt: 2 }}
          >
            {`Editar Info de Objetivo con ID #${id}`}
          </Typography>
          <Divider sx={{ mt: 1 }} />
          <Box sx={{ mb: 2, pt: 2 }}>
            <InputLabel id="value-label">Nuevo Valor</InputLabel>
            <TextField
              fullWidth
              required
              id="value"
              type="number"
              name="value"
              value={value || ""}
              variant="outlined"
              inputProps={{ min: 0 }}
              onChange={(e) => {
                const v = e.target.value;
                if (v === "" || /^\d+$/.test(v)) setValue(v);
              }}
            />
          </Box>
          <Button
            variant="contained"
            onClick={ActualizarObjetivo}
            sx={{
              background: `linear-gradient(90deg, ${palette.primaryDark} 0%, ${palette.primary} 70%)`,
              fontWeight: 'bold',
              boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
              '&:hover': { background: palette.primaryDark }
            }}
            disabled={
              isSubmitting ||
              value === undefined ||
              value === "" ||
              isNaN(parseInt(value, 10))
            }
          >
            {isSubmitting ? "Procesando..." : "Actualizar"}
          </Button>
        </Box>
      </Modal>
    </>
  );

  useEffect(() => {
    if (Array.isArray(data) && data.length > 0) {
      const map = data.reduce((acc, item) => {
        const key = item.origen || "Sin Información";
        const val = Number(item.facilidades) || 0;
        acc[key] = (acc[key] || 0) + val;
        return acc;
      }, {});
      const arr = Object.entries(map).map(([origen, total]) => ({ origen, total }));
      arr.sort((a, b) => b.total - a.total);
      setOrigenes(arr);
    } else {
      setOrigenes([]);
    }
  }, [data]);

  // Auto fetch when both filters selected (after user validation logic sets them)
  useEffect(() => {
    if (gerencia && mes) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gerencia, mes]);

  // VALIDACION PARA USUARIO
  useEffect(() => {
    if (user_id === 13) {
      setGerencia("Metropolitana");
      setHabilitado(true);
    } else if (user_id === 14) {
      setGerencia("Biobío");
      setHabilitado(true);
    }
  }, [user_id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <MainLayout showNavbar={true}>
      <Box
        sx={{
          py: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '90vh',
          px: { xs: 2, md: 4 },
          background: palette.bgGradient,
          position: 'relative',
          '::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 18% 22%, rgba(255,255,255,0.08), transparent 60%), radial-gradient(circle at 82% 78%, rgba(255,255,255,0.06), transparent 65%)',
            pointerEvents: 'none'
          }
        }}
      >
        {error && (
          <Box sx={{ mt: 2, color: 'error.main', fontWeight: 'bold' }}>{error}</Box>
        )}
        {openModal && setModal()}
        {origenes && origenes.length > 0 ? (
          <Box
            sx={{
              width: { xs: '100%', md: '55%' },
              display: 'flex',
              justifyContent: 'center',
              mt: 2,
              mb: 2,
              borderRadius: 2,
              border: `1px solid ${palette.borderSubtle}`,
              background: 'rgba(255,255,255,0.92)',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 6px 20px rgba(0,0,0,0.18)'
            }}
          >
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {["ORIGEN", "TOTAL"].map((header) => (
                      <TableCell key={header} align="left" sx={headerCellSx}>
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {origenes.map((row, index) => (
                    <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? 'rgba(255,255,255,0.6)' : 'rgba(240,245,250,0.6)' }}>
                      <TableCell align="left" sx={bodyCellSx}>
                        <Typography fontFamily={'initial'} variant="secondary">
                          {row.origen ? row.origen : 'Sin Información'}
                        </Typography>
                      </TableCell>
                      <TableCell align="left" sx={bodyCellSx}>
                        <Typography fontFamily={'initial'} variant="secondary">
                          {row.total ? row.total : 0}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ) : null}
        <Box
          sx={{
            width: '90%',
            borderRadius: '10',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          {setFilter()}
          {setTable()}
        </Box>
      </Box>
    </MainLayout>
  );
}

export default ObjetivosView;
