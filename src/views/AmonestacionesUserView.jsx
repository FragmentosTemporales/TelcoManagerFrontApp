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
import BarChartIcon from "@mui/icons-material/BarChart";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSolicitudesByUser } from "../api/solicitudAPI";
import { setMessage } from "../slices/solicitudSlice";
import SolicitudChartsByUser from "../components/solicitudByUserChart";

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

  const toggleStatistics = () => {
    setShowStatistics((prev) => !prev);
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

  const createNew = () => (
    <>
      <Box
        sx={{
          width: "90%",
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
              borderRadius: "0px",
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
    </>
  );

  const setTableCard = () => (
    <TableContainer
      component={Paper}
      sx={{ width: "90%", height: "100%", overflow: "auto", marginTop: 2 }}
    >
      <Table stickyHeader>
        {setTableHead()}
        {setTableBody()}
      </Table>
    </TableContainer>
  );

  const statisticsCard = () => (
    <Card
      sx={{
        width: "90%",
        overflow: "hidden",
        backgroundColor: "white",
        boxShadow: 5,
        textAlign: "center",
        borderRadius: "0px",
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
          <SolicitudChartsByUser />
        </CardContent>
      )}
    </Card>
  );

  useEffect(() => {
    fetchData();
  }, [page]);

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
        backgroundColor: "#f0f0f0",
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
      {statisticsCard()}
      {createNew()}
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
  );
}

export default AmonesatacionesViewer;
