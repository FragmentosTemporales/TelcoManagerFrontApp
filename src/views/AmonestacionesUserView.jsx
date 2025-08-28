import { Alert, Box, Button, ButtonGroup, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSolicitudesByUser } from "../api/solicitudAPI";
import { setMessage } from "../slices/solicitudSlice";
import { MainLayout } from "./Layout";
import palette from "../theme/palette";

function AmonesatacionesViewer() {
  // auth state kept for potential future use (user, estacion, etc.)
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [pages, setPages] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // removed unused showStatistics state

  const handleClose = () => setOpen(false);

  const fetchData = async () => {
    try {
      setIsSubmitting(true);
  const res = await getSolicitudesByUser(page);
      setData(res.data);
      setPages(res.pages);
      setIsSubmitting(false);
    } catch (error) {
      dispatch(setMessage("Información no encontrada."));
      setOpen(true);
      setIsSubmitting(false);
    }
  };

  const handlePage = (newPage) => setPage(newPage);

  const subtleBtn = {
    border: `1px solid ${palette.borderSubtle}`,
    color: palette.primary,
    fontWeight: 600,
    textTransform: 'none',
    background: 'rgba(255,255,255,0.6)',
    backdropFilter: 'blur(6px)',
    boxShadow: '0 3px 10px rgba(0,0,0,0.15)',
    '&:hover': { borderColor: palette.accent, background: 'rgba(255,255,255,0.85)' },
    '&:disabled': { opacity: .45 }
  };

  const getButtons = () => (
    <>
      <Button key="prev" onClick={() => handlePage(page - 1)} disabled={page === 1} sx={subtleBtn}>
        <ArrowBackIosIcon fontSize="small" />
      </Button>
      <Button key="current" disabled sx={{ ...subtleBtn, fontWeight: 700 }}>{page}</Button>
      <Button key="next" onClick={() => handlePage(page + 1)} disabled={page === pages} sx={subtleBtn}>
        <ArrowForwardIosIcon fontSize="small" />
      </Button>
    </>
  );

  const setTableHead = () => (
    <TableHead>
      <TableRow>
        {["N° FOLIO", "MOTIVO", "FORMULARIO", "SOLICITANTE", "AMONESTADO", "ESTADO"].map(header => (
          <TableCell key={header} align="center" sx={{ background: `linear-gradient(120deg, ${palette.primaryDark} 0%, ${palette.primary} 80%)`, color: '#fff', py: 1.5 }}>
            <Typography sx={{ fontWeight: 700, letterSpacing: .4, fontSize: 13 }}>{header}</Typography>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
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
              sx={{ textDecoration: 'none', cursor: 'pointer', backgroundColor: '#ffffffcc', backdropFilter: 'blur(4px)', transition: 'background-color .25s', '&:hover': { backgroundColor: '#ffffff' } }}
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
              <Typography >
                No hay datos disponibles
              </Typography>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </>
  );

  const setTableCard = () => (
    <TableContainer sx={{ width: '90%', height: '100%', overflow: 'auto', mt: 2, borderRadius: 3, border: `1px solid ${palette.borderSubtle}`, background: palette.cardBg, backdropFilter: 'blur(8px)', boxShadow: '0 6px 24px rgba(0,0,0,0.15)' }}>
      <Table stickyHeader>
        {setTableHead()}
        {setTableBody()}
      </Table>
    </TableContainer>
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchData();
  }, [page]);

  return (
    <MainLayout showNavbar={true}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', minHeight: '90vh', width: '100%', overflow: 'auto', py: 8, background: palette.bgGradient, position: 'relative', '::before': { content: '""', position: 'absolute', inset: 0, background: 'radial-gradient(circle at 20% 18%, rgba(255,255,255,0.085), transparent 60%), radial-gradient(circle at 78% 75%, rgba(255,255,255,0.06), transparent 65%)', pointerEvents: 'none' } }}>
        {open && (
          <Alert onClose={handleClose} severity="info" sx={{ mb: 3, width: '80%', backdropFilter: 'blur(6px)', background: `${palette.cardBg}aa`, border: `1px solid ${palette.borderSubtle}` }}>
            <Typography fontWeight={600}>Mensaje</Typography>
          </Alert>
        )}
        {isSubmitting ? (
          <Box sx={{ width: '90%', mt: 2, border: `1px solid ${palette.borderSubtle}`, background: palette.cardBg, backdropFilter: 'blur(10px)', borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.25)', display: 'flex', justifyContent: 'center' }}>
            <Skeleton variant="rounded" width={'100%'} height={500} sx={{ m: 3 }} />
          </Box>
        ) : (
          <>
            {setTableCard()}
            <ButtonGroup size="small" aria-label="pagination-button-group" sx={{ p: 2, gap: 1 }}>
              {getButtons()}
            </ButtonGroup>
          </>
        )}
      </Box>
    </MainLayout>
  );
}

export default AmonesatacionesViewer;
