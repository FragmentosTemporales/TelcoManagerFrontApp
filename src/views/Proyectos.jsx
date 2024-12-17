import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import AdjustIcon from "@mui/icons-material/Adjust";
import AddIcon from "@mui/icons-material/Add";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { createProject, getEmpresas } from "../api/proyectoAPI";
import { getUsersEmpresa } from "../api/authAPI";
import { useNavigate } from "react-router-dom";

function ProyectosView() {
  const authState = useSelector((state) => state.auth);
  const proyectoState = useSelector((state) => state.proyectos);
  const { token } = authState;
  const { data } = proyectoState;
  const navigate = useNavigate();
  const [options, setOptions] = useState([]);
  const [proyectoID, setproyectoID] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [proyecto, setProyecto] = useState(null);
  const [dataEmpresa, setDataEmpresas] = useState([]);
  const [dataUser, setDataUser] = useState(undefined);
  const [externo, setExterno] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [open, setOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("info");
  const [form, setForm] = useState({
    userID: "",
  });

  //FUNCIONES

  const fetchEmpresas = async () => {
    const res = await getEmpresas(token);
    const empresas = res.map((item) => ({
      value: item.empresaID,
      label: item.nombre,
    }));
    setDataEmpresas(empresas);
  };

  const fetchUsers = async (empresaID) => {
    const res = await getUsersEmpresa(token, empresaID);
    const data = res.map((item) => ({
      value: item.userID,
      label: item.nombre,
    }));
    setDataUser(data);
  };

  useEffect(() => {
    externo ? fetchUsers(externo) : null;
  }, [externo]);

  const fetchOptions = () => {
    const transformedOptions = data.map((item) => ({
      value: item.proyecto,
      label: item.proyecto,
    }));
    setOptions(transformedOptions);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const createproyecto = async () => {
    const formulario = {
      proyectoID: proyectoID,
      empresaID: externo,
      proyectoEstadoID: 2,
      userID: form.userID,
    };
    try {
      setIsSubmitting(true);
      const res = await createProject(formulario, token);
      setMensaje(res.message);
      setOpenModal(false);
      setAlertSeverity("success");
      setExterno(null);
      setIsSubmitting(false);
      setOpen(true);
      setTimeout(() => {
        navigate(`/asignado/${proyectoID}`);
      }, 2000);
    } catch (error) {
      setMensaje(error);
      setIsSubmitting(false);
      setAlertSeverity("error");
      setOpen(true);
      setExterno(null);
      setOpenModal(false);
    }
  };

  // USEEFFECTS

  useEffect(() => {
    if (proyectoID) {
      const foundInfo = data.find((item) => item.proyecto === proyectoID);
      setProyecto(foundInfo);
    }
  }, [proyectoID]);

  useEffect(() => {
    if (data) {
      fetchOptions();
    }
  }, [data]);

  useEffect(() => {
    fetchEmpresas();
  }, []);

  //COMPONENTES

  const proyectoCard = () => (
    <>
      {proyectoID ? (
        <Card sx={{ width: "90%", borderRadius: "0" }}>
          <CardHeader
            title={
              <Typography fontWeight="bold" sx={{ fontFamily: "initial" }}>
                PROYECTO #{proyectoID}
              </Typography>
            }
            avatar={<AdjustIcon />}
            sx={{
              background: "#0b2f6d",
              color: "white",
              textAlign: "end",
            }}
          />
          <CardContent sx={{ display: "flex", justifyContent: "center" }}>
            {proyecto ? (
              <Paper sx={{ width: "90%", textAlign: "start" }}>
                <Grid container spacing={2}>
                  {/* REGION */}
                  <Grid item xs={12} sm={3}>
                    <Typography
                      fontWeight="bold"
                      sx={{
                        fontFamily: "initial",
                        background: "#e8e8e8",
                        p: 1,
                      }}
                    >
                      REGION :
                    </Typography>
                    <Typography sx={{ fontFamily: "initial", p: 1 }}>
                      {proyecto.region ? proyecto.region : "Sin Información"}
                    </Typography>
                  </Grid>

                  {/* COMUNA */}
                  <Grid item xs={12} sm={3}>
                    <Typography
                      fontWeight="bold"
                      sx={{
                        fontFamily: "initial",
                        background: "#e8e8e8",
                        p: 1,
                      }}
                    >
                      COMUNA :
                    </Typography>
                    <Typography sx={{ fontFamily: "initial", p: 1 }}>
                      {proyecto.comuna ? proyecto.comuna : "Sin Información"}
                    </Typography>
                  </Grid>

                  {/* DIRECCION */}
                  <Grid item xs={12} sm={3}>
                    <Typography
                      fontWeight="bold"
                      sx={{
                        fontFamily: "initial",
                        background: "#e8e8e8",
                        p: 1,
                      }}
                    >
                      DIRECCION :
                    </Typography>
                    <Typography sx={{ fontFamily: "initial", p: 1 }}>
                      {proyecto.direccion
                        ? proyecto.direccion
                        : "Sin Información"}
                    </Typography>
                  </Grid>

                  {/* TARGET RTS */}
                  <Grid item xs={12} sm={3}>
                    <Typography
                      fontWeight="bold"
                      sx={{
                        fontFamily: "initial",
                        background: "#e8e8e8",
                        p: 1,
                      }}
                    >
                      TARGET RTS :
                    </Typography>
                    <Typography sx={{ fontFamily: "initial", p: 1 }}>
                      {proyecto["Target RTS"]
                        ? proyecto["Target RTS"]
                        : "Sin Información"}
                    </Typography>
                  </Grid>

                  {/* FUENTE */}
                  <Grid item xs={12} sm={3}>
                    <Typography
                      fontWeight="bold"
                      sx={{
                        fontFamily: "initial",
                        background: "#e8e8e8",
                        p: 1,
                      }}
                    >
                      FUENTE :
                    </Typography>
                    <Typography sx={{ fontFamily: "initial", p: 1 }}>
                      {proyecto["Fuente"]
                        ? proyecto["Fuente"]
                        : "Sin Información"}
                    </Typography>
                  </Grid>

                  {/* ORIGEN */}
                  <Grid item xs={12} sm={3}>
                    <Typography
                      fontWeight="bold"
                      sx={{
                        fontFamily: "initial",
                        background: "#e8e8e8",
                        p: 1,
                      }}
                    >
                      ORIGEN :
                    </Typography>
                    <Typography sx={{ fontFamily: "initial", p: 1 }}>
                      {proyecto["Origen"]
                        ? proyecto["Origen"]
                        : "Sin Información"}
                    </Typography>
                  </Grid>

                  {/* FACILIDADES */}
                  <Grid item xs={12} sm={3}>
                    <Typography
                      fontWeight="bold"
                      sx={{
                        fontFamily: "initial",
                        background: "#e8e8e8",
                        p: 1,
                      }}
                    >
                      FACILIDADES :
                    </Typography>
                    <Typography sx={{ fontFamily: "initial", p: 1 }}>
                      {proyecto["uip"] ? proyecto["uip"] : "Sin Información"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography
                      fontWeight="bold"
                      sx={{
                        fontFamily: "initial",
                        background: "#e8e8e8",
                        p: 1,
                      }}
                    >
                      TIPO :
                    </Typography>
                    <Typography sx={{ fontFamily: "initial", p: 1 }}>
                      {proyecto["Tipo"] ? proyecto["Tipo"] : "Sin Información"}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            ) : (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Typography fontWeight="bold" sx={{ fontFamily: "initial" }}>
                  Proyecto sin Información
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      ) : null}
    </>
  );

  const empresaCard = () => (
    <>
      {proyectoID ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            pt: 2,
          }}
        >
          <Card sx={{ width: "90%", borderRadius: "0", mb: 2 }}>
            <CardHeader
              title={
                <Typography fontWeight="bold" sx={{ fontFamily: "initial" }}>
                  GESTION DE PROYECTOS
                </Typography>
              }
              avatar={<AddIcon />}
              sx={{
                background: "#0b2f6d",
                color: "white",
                textAlign: "end",
              }}
            />
            <CardContent>
              <Box
                sx={{ m: 2, display: "flex", justifyContent: "space-around" }}
              >
                {dataEmpresa.length > 0 ? (
                  <>
                    <Box sx={{ width: "400px" }}>
                      <Autocomplete
                        options={dataEmpresa}
                        getOptionLabel={(option) => option.label}
                        onChange={(event, newValue) => {
                          setExterno(newValue ? newValue.value : null);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Seleccionar Contratista"
                            variant="outlined"
                          />
                        )}
                        isOptionEqualToValue={(option, value) =>
                          option.value === value.value
                        }
                      />
                    </Box>
                    {dataUser ? (
                      <Box sx={{ width: "400px" }}>
                        <Autocomplete
                          options={dataUser}
                          getOptionLabel={(option) => option.label}
                          onChange={(event, newValue) => {
                            setForm((prevForm) => ({
                              ...prevForm,
                              userID: newValue ? newValue.value : "",
                            }));
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Seleccionar Usuario"
                              variant="outlined"
                            />
                          )}
                          isOptionEqualToValue={(option, value) =>
                            option.value === value.value
                          }
                        />
                      </Box>
                    ) : (
                      <CircularProgress />
                    )}

                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Button
                        variant="contained"
                        sx={{ background: "#0b2f6d", borderRadius: 0 }}
                        onClick={() => {
                          setOpenModal(true);
                        }}
                        disabled={!externo} // Desactiva si no hay contratista seleccionado
                      >
                        VINCULAR
                      </Button>
                    </Box>
                  </>
                ) : (
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <CircularProgress />
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Box>
      ) : null}
    </>
  );

  const setModal = () => (
    <>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "600px",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Box sx={{ textAlign: "center", pb: 2 }}>
            <Typography
              variant="h5"
              fontWeight="bold"
              fontFamily="initial"
              sx={{ pt: 2 }}
            >
              ¿Quieres asociar este proyecto a esta empresa?
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", pt: 2 }}>
            <Button
              variant="contained"
              onClick={() => {
                createproyecto();
              }}
              sx={{
                borderRadius: 0,
                background: "#0b2f6d",
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Procesando..." : "Aceptar"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );

  return (
    <Box
      sx={{
        display: "column",
        justifyContent: "center",
        minHeight: "90vh",
        paddingTop: { xs: 10, md: 8 },
        mt: 2,
      }}
    >
      {open && (
        <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <Alert
            onClose={handleClose}
            severity={alertSeverity}
            sx={{ marginBottom: 3, width: "90%" }}
          >
            {mensaje}
          </Alert>
        </Box>
      )}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Card sx={{ width: "90%", borderRadius: "0", mb: 2 }}>
          <CardHeader
            title={
              <Typography fontWeight="bold" sx={{ fontFamily: "initial" }}>
                PROYECTOS ONNET
              </Typography>
            }
            avatar={<AccountTreeIcon />}
            sx={{
              background: "#0b2f6d",
              color: "white",
              textAlign: "end",
            }}
          />
          <CardContent>
            <Box sx={{ m: 2, display: "flex", justifyContent: "space-around" }}>
              {options.length > 0 ? (
                <>
                  <Box sx={{ width: "400px" }}>
                    <Autocomplete
                      options={options}
                      getOptionLabel={(option) => option.label}
                      onChange={(event, newValue) => {
                        setproyectoID(newValue ? newValue.value : null);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Seleccionar proyecto"
                          variant="filled"
                        />
                      )}
                      isOptionEqualToValue={(option, value) =>
                        option.value === value.value
                      }
                    />
                  </Box>
                </>
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <CircularProgress />
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>

        {proyectoCard()}

        {empresaCard()}

        {setModal()}
      </Box>
    </Box>
  );
}

export default ProyectosView;
