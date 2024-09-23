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
  Tooltip,
  CardContent,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSolicitudEstado } from "../api/seAPI";
import { getSolicitudes, getFilteredSolicitudes } from "../api/solicitudAPI";
import { onLoad, onLoading, setMessage } from "../slices/solicitudSlice";

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

  const handleClose = () => setOpen(false);

  const fetchData = async () => {
    try {
      dispatch(onLoading());

      const res =
        filterID === undefined
          ? await getSolicitudes(token, page)
          : await getFilteredSolicitudes(token, filterID, page);
      dispatch(onLoad(res));
    } catch (error) {
      dispatch(setMessage("Información no encontrada."));
      setOpen(true);
    }
  };

  const handleClear = async (e) => {
    e.preventDefault();
    setFilterID(undefined);
  };

  const fetchOptions = async () => {
    try {
      const res = await getSolicitudEstado(token);
      const transformedOptions = res.map((item) => ({
        value: item.solicitudEstadoID,
        label: item.descri,
      }));
      setOptions(transformedOptions);
    } catch (error) {
      console.error("Error fetching options:", error);
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

  useEffect(() => {
    fetchData();
  }, [page, filterID]);

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
      <Card
        sx={{
          width: "80%",
          overflow: "hidden",
          backgroundColor: "#f5f5f5",
          boxShadow: 5,
          textAlign: "center",
          borderRadius: "0px",
          mt: 2,
        }}
      >
        <CardHeader
          title="FILTRAR SOLICITUDES SEGUN ESTADO"
          sx={{
            backgroundColor: "#0b2f6d",
            color: "white",
            padding: "10px",
            borderBottom: "1px solid #ddd",
            fontWeight: "bold",
          }}
        />
        <CardContent>
          <form >
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
                sx={{ minWidth: "200px", height:"40px" }}
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
                sx={{ fontWeight: "bold", background: "#0b2f6d", minWidth:"200px", height:"40px" }}
              >
                LIMPIAR FILTROS
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
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
      {is_loading && !is_load ? (
        <Box
          sx={{
            width: "80%",
            overflow: "hidden",
            backgroundColor: "#f5f5f5",
            boxShadow: 5,
            textAlign: "center",
            borderRadius: "0px",
            minHeight: "250px",
            mt: 2,
          }}
        >
          <Skeleton
            variant="rounded"
            width={"90%"}
            height={"70%"}
            sx={{ p: 3, m: 3 }}
          />
        </Box>
      ) : (
        <>
          <Card
            sx={{
              width: "80%",
              overflow: "hidden",
              backgroundColor: "#f5f5f5",
              boxShadow: 5,
              textAlign: "center",
              borderRadius: "0px",
              minHeight: "250px",
              mt: 2,
            }}
          >
            <CardHeader
              title="LISTA DE SOLICITUDES DE AMONESTACION"
              sx={{
                backgroundColor: "#0b2f6d",
                color: "white",
                padding: "10px",
                borderBottom: "1px solid #ddd",
                fontWeight: "bold",
              }}
            />
            <TableContainer
              component={Paper}
              sx={{ width: "100%", height: "100%", overflow: "auto" }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {[
                      "FECHA SOLICITUD",
                      "N° SOLICITUD",
                      "FORMULARIO",
                      "SOLICITANTE",
                      "AMONESTADO",
                      "ACCIONES",
                    ].map((header) => (
                      <TableCell
                        key={header}
                        align="center"
                        sx={{ background: "#d8d8d8", fontWeight: "bold" }}
                      >
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data && data.length > 0 ? (
                    data.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell align="center">
                          {row.fechaSolicitud}
                        </TableCell>
                        <TableCell align="center">
                          {row.numeroSolicitud}
                        </TableCell>
                        <TableCell align="center">{row.nombreArea}</TableCell>
                        <TableCell align="center">{row.solicitante}</TableCell>
                        <TableCell align="center">{row.amonestado}</TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            display: "flex",
                            justifyContent: "space-around",
                          }}
                        >
                          <Tooltip
                            title="Visualizar Solicitud"
                            placement="left"
                          >
                            <Button
                              variant="contained"
                              sx={{
                                width: 30,
                                height: 30,
                                minWidth: 30,
                                padding: 0,
                                background: "#0b2f6d",
                              }}
                            >
                              <Link
                                style={{
                                  color: "white",
                                  textDecoration: "none",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                                to={`/solicitud/${row.numeroSolicitud}`}
                              >
                                <FindInPageIcon />
                              </Link>
                            </Button>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No hay datos disponibles
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
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
