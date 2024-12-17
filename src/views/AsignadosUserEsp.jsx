import {
    Box,
    Button,
    ButtonGroup,
    Card,
    Chip,
    CardHeader,
    Paper,
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
  import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
  import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
  import { Link } from "react-router-dom";
  import { useDispatch, useSelector } from "react-redux";
  import { useEffect, useState } from "react";
  import {
    onLoading as onLoadingAsignados,
  } from "../slices/asignadosSlice";
  import {
    getAsignadosUser
  } from "../api/proyectoAPI";
  
  function AsignadosViewUser() {
    const authState = useSelector((state) => state.auth);
    const { empresa, user_id ,permisos, token} = authState;
    const [moduloPermiso, setModuloPermiso] = useState(null);
    const [data, setData] = useState(undefined)
  
    useEffect(() => {
      const info = permisos.find((item) => item.moduloID == 6);
      setModuloPermiso(info);
    }, [permisos]);
  
    const createNew = () => (
      <>
        {moduloPermiso && moduloPermiso["edit"] == true ? (
          <Box
            sx={{
              width: "60%",
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
                  borderRadius: "0px",
                }}
              >
                <AddCircleOutlineIcon /> Crear Nueva
              </Button>
            </Link>
          </Box>
        ) : null}
      </>
    );
    
    const fetchAsignados = async () => {
      try {
        const res = await getAsignadosUser(token);
        setData(res);
      } catch (error) {
       console.log(error)
      }
    };
  
    const fetchData = async () => {
        fetchAsignados();
    };
  
    useEffect(() => { fetchData(); }, [empresa, user_id])
  
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
          <Card
            sx={{
              width: "60%",
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
                    {["EMPRESA", "PROYECTO", "ESTADO", "ACCIONES"].map(
                      (header) => (
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
                      )
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data && data.length > 0 ? (
                    data.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell
                          align="center"
                          sx={{ fontWeight: "bold", fontFamily: "initial" }}
                        >
                          {row.empresa && row.empresa.nombre != null
                            ? row.empresa.nombre
                            : "Sin Información"}
                        </TableCell>
                        <TableCell align="center" sx={{ fontFamily: "initial" }}>
                          {row.proyectoID ? row.proyectoID : "Sin Información"}
                        </TableCell>
                        <TableCell align="center" sx={{ fontFamily: "initial" }}>
                          {row.estado && row.estado.descri ? (
                            (() => {
                              switch (row.estado.descri) {
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
  
                        <TableCell align="center">
                          <Tooltip title="Agregar Componentes">
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
                                to={`/asignado/${row.proyectoID}`}
                              >
                                <LibraryAddIcon />
                              </Link>
                            </Button>
                          </Tooltip>
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
        </>
      </Box>
    );
  }
  
  export default AsignadosViewUser;
  