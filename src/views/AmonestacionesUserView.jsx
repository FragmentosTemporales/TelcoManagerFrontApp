import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSolicitudesByUser } from "../api/solicitudAPI";
import { setMessage } from "../slices/solicitudSlice";
import { MainLayout } from "./Layout";

function AmonesatacionesViewer() {
  const authState = useSelector((state) => state.auth);
  const { token } = authState;
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [pages, setPages] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);

  const handleClose = () => setOpen(false);

  const fetchData = async () => {
    try {
      setIsSubmitting(true);
      const res = await getSolicitudesByUser(token, page);
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
              fontWeight: "bold",
              backgroundColor: "#0b2f6d",
              color: "white",
            }}
          >
            <Typography>{header}</Typography>
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
    <TableContainer
      sx={{
        width: "90%",
        height: "100%",
        overflow: "auto",
        marginTop: 2,
        borderRadius: 2,
        border: "2px solid #dfdeda",
        backgroundColor: "white",
      }}
    >
      <Table stickyHeader>
        {setTableHead()}
        {setTableBody()}
      </Table>
    </TableContainer>
  );


  useEffect(() => {
    fetchData();
  }, [page]);

  return (
    <MainLayout showNavbar={true}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          width: "100%",
          overflow: "auto",
          paddingY: "60px",
          backgroundColor: "#f0f0f0",
          minHeight: "90vh",
        }}
      >
        {open && (
          <Alert
            onClose={handleClose}
            severity="info"
            sx={{ marginTop: "2%", width: "80%" }}
          >
            <Typography fontFamily="initial" fontWeight="bold">
              Mensaje
            </Typography>
          </Alert>
        )}

        {isSubmitting ? (
          <Box
            sx={{
              width: "90%",
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
              width={"100%"}
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
    </MainLayout>
  );
}

export default AmonesatacionesViewer;
