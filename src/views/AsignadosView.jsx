import {
  Box,
  Button,
  ButtonGroup,
  Card,
  Chip,
  CardHeader,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import BallotIcon from "@mui/icons-material/Ballot";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  onLoad as onLoadAsignados,
  onLoading as onLoadingAsignados,
} from "../slices/asignadosSlice";
import { getaLLAsignados } from "../api/proyectoAPI";

function AsignadosView() {
  const authState = useSelector((state) => state.auth);
  const asignadosState = useSelector((state) => state.asignados);
  const { permisos, token } = authState;
  const { data, pages, is_loading, is_load } = asignadosState;
  const [moduloPermiso, setModuloPermiso] = useState(null);
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);

  useEffect(() => {
    const info = permisos.find((item) => item.moduloID == 6);
    setModuloPermiso(info);
  }, [permisos]);

  const createNew = () => (
    <>
      {moduloPermiso && moduloPermiso["edit"] == true ? (
        <Box
          sx={{
            width: "80%",
            mt: 2,
            display: "flex",
            justifyContent: "start",
          }}
        >
          <Link
            style={{ color: "white", textDecoration: "none" }}
            to="/proyectos"
          >
            <Button
              variant="contained"
              sx={{
                width: 200,
                height: 40,
                fontWeight: "bold",
                display: "flex",
                justifyContent: "space-around",
                background: "#0b2f6d",
                borderRadius: "20px",
              }}
            >
              <AddCircleOutlineIcon /> Crear Nueva
            </Button>
          </Link>
        </Box>
      ) : null}
    </>
  );

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

  const fetchAllAsignados = async () => {
    try {
      dispatch(onLoadingAsignados());
      const res = await getaLLAsignados(token, page);
      dispatch(onLoadAsignados(res));
    } catch (error) {
      dispatch(setMessage("Información no encontrada."));
    }
  };

  useEffect(() => {
    fetchAllAsignados();
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
        minHeight: "80vh",
      }}
    >
      <>
        {createNew()}
        {is_loading ? (
          <Skeleton
            variant="rectangular"
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
          />
        ) : (
          <Card
            sx={{
              width: "80%",
              overflow: "hidden",
              backgroundColor: "#f5f5f5",
              boxShadow: 5,
              textAlign: "center",
              borderRadius: "20px",
              minHeight: "250px",
              mt: 2,
            }}
          >
            <CardHeader
              title={
                <Typography fontWeight="bold" sx={{ fontFamily: "initial" }}>
                  ASIGNADOS
                </Typography>
              }
              avatar={<BallotIcon />}
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
                <TableHead>
                  <TableRow>
                    {[
                      "EMPRESA",
                      "USUARIO",
                      "PROYECTO",
                      "ESTADO",
                    ].map((header) => (
                      <TableCell
                        key={header}
                        align="center"
                        sx={{
                          background: "#d8d8d8",
                          fontWeight: "bold",
                          fontFamily: "initial",
                        }}
                      >
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data && data.length > 0 ? (
                    data.map((row, index) => (
                      <TableRow
                        key={index}
                        component={Link}
                        to={`/asignado/${row.proyectoID}`}
                        sx={{
                          textDecoration: "none",
                          cursor: "pointer",
                          "&:hover": { backgroundColor: "#f5f5f5" }, // Cambio de color al pasar el mouse
                        }}
                      >
                        <TableCell
                          align="center"
                          sx={{ fontWeight: "bold", fontFamily: "initial" }}
                        >
                          {row.empresa && row.empresa
                            ? row.empresa
                            : "Sin Información"}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ fontWeight: "bold", fontFamily: "initial" }}
                        >
                          {row.usuario && row.usuario
                            ? row.usuario
                            : "Sin Información"}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ fontFamily: "initial" }}
                        >
                          {row.proyectoID ? row.proyectoID : "Sin Información"}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ fontFamily: "initial" }}
                        >
                          {row.descri && row.descri ? (
                            (() => {
                              switch (row.descri) {
                                case "Iniciado":
                                  return (
                                    <Chip
                                      color="success"
                                      label="Iniciado"
                                      sx={{ width: "200px" }}
                                    />
                                  );
                                case "Asignado contratista":
                                  return (
                                    <Chip
                                      color="primary"
                                      label="Asignado contratista"
                                      sx={{ width: "200px" }}
                                    />
                                  );
                                case "Asignado componente":
                                  return (
                                    <Chip
                                      color="warning"
                                      label="Asignado componente"
                                      sx={{ width: "200px" }}
                                    />
                                  );
                                case "En Ejecucion":
                                  return (
                                    <Chip
                                      color="info"
                                      label="En Ejecución"
                                      sx={{ width: "200px" }}
                                    />
                                  );
                                case "Finalizado":
                                  return (
                                    <Chip
                                      color="secondary"
                                      label="Finalizado"
                                      sx={{ width: "200px" }}
                                    />
                                  );
                                default:
                                  return (
                                    <Chip
                                      color="default"
                                      label="Estado Desconocido"
                                    />
                                  );
                              }
                            })()
                          ) : (
                            <Chip color="default" label="Sin Estado" />
                          )}
                        </TableCell>

                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        align="center"
                        sx={{ fontFamily: "initial" }}
                      >
                        No hay datos disponibles
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        )}

        <ButtonGroup
          size="small"
          aria-label="pagination-button-group"
          sx={{ p: 2 }}
        >
          {getButtons()}
        </ButtonGroup>
      </>
    </Box>
  );
}

export default AsignadosView;
