import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  InputLabel,
  Modal,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TextField,
  Typography,
  Tooltip,
  Divider,
} from "@mui/material";
import ApiIcon from "@mui/icons-material/Api";
import ArticleIcon from "@mui/icons-material/Article";
import DataSaverOnIcon from "@mui/icons-material/DataSaverOn";
import DeleteIcon from "@mui/icons-material/Delete";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import InfoIcon from "@mui/icons-material/Info";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  getComponenteUnico,
  createRecurso,
  deleteRecurso,
  createMedicionCTO
} from "../api/proyectoAPI";
import { fetchFileUrl } from "../api/downloadApi";

function ComponenteAsignadoView() {
  const { componenteID } = useParams();
  const authState = useSelector((state) => state.auth);
  const { token } = authState;
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(undefined);
  const [formulario, setFormulario] = useState([]);
  const [recurso, setRecurso] = useState(undefined);
  const [proyectoID, setProyectoID] = useState(undefined);
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [message, setMessage] = useState(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("Title");
  const [filterForm, setFilterForm] = useState(undefined);
  const [toDelete, setToDelete] = useState(undefined);
  const [medicionCTO, setMedicionCTO] = useState(undefined);

  const [existCTO, setExistCTO] = useState(false);

  const [existPowerMetter, setExistPowerMetter] = useState(false);

  const [elementos, setElementos] = useState([]);

  useEffect(() => {
    const existeRecurso = elementos.some(
      (obj) => obj.pregunta === "Medición Power Metter"
    );
    if (existeRecurso) {
      setExistPowerMetter(true);
    } else {
      setExistPowerMetter(false);
    }
  }, [elementos]);

  const [form, setForm] = useState({
    respuesta: "",
    formComponenteID: "",
    componenteID: "",
    file: null,
  });

  const [formPM, setFormPM] = useState({
    componenteID: "",
    value_1: 0,
    value_2: 0,
    value_3: 0,
    value_4: 0,
    value_5: 0,
    value_6: 0,
    value_7: 0,
    value_8: 0,
  });

  const fetchData = async () => {
    try {
      const res = await getComponenteUnico(token, componenteID);
      setData(res);
      setMedicionCTO(res.medicioncto[0]);
      setProyectoID(res.proyectoID);
      setRecurso(res.recurso);
      setFormulario(res.componentetipo.formulario);
      setIsLoading(false);
    } catch (error) {
      setMessage(error);
      setOpen(true);
      setIsLoading(false);
    }
  };

  const fetchIMAGEN = async () => {
    const nuevosElementos = [];
    for (const item of recurso) {
      const objeto = {};
      objeto["file"] = await fetchFileUrl({ file_path: item.file }, token);
      objeto["recursoID"] = item.recursoID;
      objeto["pregunta"] = item.formulario.pregunta;
      objeto["respuesta"] = item.respuesta;
      objeto["formComponenteID"] = item.formComponenteID;
      nuevosElementos.push(objeto);
    }
    setElementos(nuevosElementos);
  };

  const deletingRecurso = async () => {
    setIsSubmitting(true);
    try {
      const res = await deleteRecurso(toDelete, token);
      setIsSubmitting(false);
      handleCloseModal();
      fetchData();
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
      handleCloseModal();
    }
  };

  useEffect(() => {
    if (recurso) {
      fetchIMAGEN();
    } else {
      null;
    }
  }, [recurso]);

  useEffect(() => {
    medicionCTO ? setExistCTO(true) : null;
  }, [medicionCTO]);

  useEffect(() => {
    const filteredData = formulario.filter(
      (item) =>
        !recurso.some(
          (recursoItem) =>
            recursoItem.formComponenteID === item.formComponenteID
        )
    );
    setFilterForm(filteredData);
  }, [formulario, recurso]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setOpenModalDelete(false);
  };

  const handleFileChange = (e) => {
    setForm({
      ...form,
      file: e.target.files[0],
    });
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangePM = (e) => {
    setFormPM({
      ...formPM,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("respuesta", form.respuesta);
    formData.append("formComponenteID", form.formComponenteID);
    formData.append("componenteID", form.componenteID);
    if (form.file) {
      formData.append("file", form.file);
    }
    try {
      const respuesta = await createRecurso(formData, token);
      setIsSubmitting(false);
      setOpenModal(false);
      setForm({
        respuesta: "",
        formComponenteID: "",
        componenteID: "",
        file: null,
      });
      fetchData();
    } catch (error) {
      setMessage("Error al enviar el formulario:", error);
      setOpen(true)
      setIsSubmitting(false);
      setForm({
        respuesta: "",
        formComponenteID: "",
        componenteID: "",
        file: null,
      });
      setOpenModal(false);
    }
  };

  const handleSubmitPM = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const respuesta = await createMedicionCTO(formPM, token);
      setIsSubmitting(false);
      fetchData();
    } catch (error) {
      setMessage("Error al enviar el formulario:", error);
      setOpen(true)
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    data
      ? setForm({
          ...form,
          componenteID: data.componenteID,
        })
      : null;
  }, [data]);

  useEffect(() => {
    data
      ? setFormPM({
          ...formPM,
          componenteID: data.componenteID,
        })
      : null;
  }, [data]);

  //COMPONENTE PARA RETORNAR LA INFORMACION GENERAL DEL COMPONENTE ASIGNADO
  const infoCard = () => (
    <>
      <Card
        sx={{
          width: "90%",
          overflow: "hidden",
          backgroundColor: "#f5f5f5",
          boxShadow: 5,
          textAlign: "center",
          borderRadius: "0px",
          mt: 2,
          mb: 2,
        }}
      >
        <CardHeader
          avatar={<InfoIcon />}
          title={
            <Typography fontWeight="bold" sx={{ fontFamily: "initial" }}>
              INFORMACION COMPONENTE #{componenteID}
            </Typography>
          }
          sx={{
            background: "#0b2f6d",
            color: "white",
            textAlign: "end",
          }}
        />
        <CardContent sx={{ p: 4, justifyContent: "center", display: "flex" }}>
          {!isLoading && data !== undefined ? (
            <Paper sx={{ width: "70%" }}>
              {[
                { label: "Proyecto :", value: data.proyectoID },
                {
                  label: "Tipo Componente :",
                  value: data.componentetipo.descri,
                },

                { label: "ID Componente :", value: data.componenteID },
                { label: "N° Referencia :", value: data.referencia },
              ].map((row, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderRadius: 1,
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      fontFamily: "initial",
                      width: "30%",
                      background: "#e8e8e8",
                      p: 1,
                    }}
                  >
                    {row.label}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "initial",
                      color: "text.secondary",
                      width: "70%",
                      p: 1,
                    }}
                  >
                    {row.value || "Sin Información"}
                  </Typography>
                </Box>
              ))}
            </Paper>
          ) : (
            <CircularProgress />
          )}
        </CardContent>
      </Card>
    </>
  );

  //COMPONENTE QUE CONTIENE TABLE HEAD Y TABLE BODY
  const setTable = () => (
    <>
      <TableContainer>
        <Table
          sx={{ width: "100%", display: "column", justifyContent: "center" }}
        >
          {setTableHead()}
          {setTableBody()}
        </Table>
      </TableContainer>
    </>
  );

  //COMPONENTE QUE CONTIENE LOS HEADERS DE LA TABLA
  const setTableHead = () => (
    <>
      <TableHead>
        <TableRow>
          {["N°", "ITEM", "ACCIONES"].map((header) => (
            <TableCell
              key={header}
              align="left"
              sx={{ background: "#d8d8d8", fontWeight: "bold" }}
            >
              {header}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    </>
  );

  //COMPONENTE QUE CONTIENE EL BODY DE LA TABLA
  const setTableBody = () => (
    <>
      <TableBody
        sx={{
          display: "column",
          justifyContent: "center",
        }}
      >
        {filterForm && filterForm.length > 0 ? (
          filterForm.map((row, index) => (
            <TableRow key={index}>
              <TableCell align="left" sx={{ fontSize: "16px" }}>
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.orden ? row.orden : "Sin Información"}
                </Typography>
              </TableCell>

              <TableCell align="left" sx={{ fontSize: "16px" }}>
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.pregunta ? row.pregunta : "Sin Información"}
                </Typography>
              </TableCell>

              <TableCell align="left" sx={{ fontSize: "16px" }}>
                <Button
                  variant="contained"
                  sx={{ background: "#0b2f6d", borderRadius: 0 }}
                  onClick={() => {
                    setOpenModal(true);
                    setForm({
                      ...form,
                      formComponenteID: row.formComponenteID,
                    });
                    setTitle(row.pregunta);
                  }}
                >
                  <DataSaverOnIcon />
                </Button>
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

  //COMPONENTE QUE CONTIENE LA TABLA
  const formCard = () => (
    <>
      <Card
        sx={{
          width: "90%",
          overflow: "hidden",
          backgroundColor: "#f5f5f5",
          boxShadow: 5,
          textAlign: "center",
          borderRadius: "0px",
          mt: 2,
          mb: 2,
        }}
      >
        <CardHeader
          avatar={<ApiIcon />}
          title={
            <Typography fontWeight="bold" sx={{ fontFamily: "initial" }}>
              PENDIENTES DE REGISTRO - COMPONENTE #{componenteID}
            </Typography>
          }
          sx={{
            background: "#0b2f6d",
            color: "white",
            textAlign: "end",
          }}
        />
        <CardContent sx={{ p: 4, justifyContent: "center", display: "flex" }}>
          {setTable()}
        </CardContent>
      </Card>
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
            textAlign: "center",
          }}
        >
          <Typography fontWeight="bold" sx={{ fontFamily: "initial" }}>
            {title}
          </Typography>
          <Box sx={{ textAlign: "center", p: 2 }}>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <Box
                sx={{
                  mb: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{ p: 2, width: { lg: "80%", xs: "100%", md: "100%" } }}
                >
                  <InputLabel id="respuesta-label">Observación</InputLabel>
                  <TextField
                    sx={{
                      whiteSpace: "normal",
                      width: "100%",
                      textAlign: "center",
                      background: "#ffffff",
                    }}
                    fullWidth
                    required
                    id="respuesta"
                    type="text"
                    name="respuesta"
                    variant="outlined"
                    value={form.respuesta}
                    onChange={handleChange}
                  />
                </Box>

                <Box
                  sx={{ p: 2, width: { lg: "80%", xs: "100%", md: "100%" } }}
                >
                  <InputLabel id="file-label">Archivo</InputLabel>
                  <TextField
                    required
                    id="file"
                    type="file"
                    name="file"
                    variant="outlined"
                    onChange={handleFileChange}
                    sx={{
                      whiteSpace: "normal",
                      width: "100%",
                      textAlign: "center",
                      background: "#ffffff",
                    }}
                  />
                </Box>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center", pt: 2 }}>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={isSubmitting}
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
                  {isSubmitting ? "Procesando..." : "Enviar"}
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Modal>
    </>
  );

  const setModalDelete = () => (
    <>
      <Modal open={openModalDelete} onClose={handleCloseModal}>
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
            textAlign: "center",
          }}
        >
          <Typography fontWeight="bold" sx={{ fontFamily: "initial" }}>
            ¿DESEAS ELIMINAR ESTE REGISTRO?
          </Typography>
          <Box sx={{ textAlign: "center", p: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "center", pt: 2 }}>
              <Button
                variant="contained"
                onClick={deletingRecurso}
                disabled={isSubmitting}
                sx={{
                  width: 200,
                  height: 40,
                  fontWeight: "bold",
                  display: "flex",
                  justifyContent: "space-around",
                  background: "#c62828",
                  borderRadius: "0px",
                }}
              >
                {isSubmitting ? "Procesando..." : "Eliminar"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );

  const cardRecurso = () => (
    <>
      <Card
        sx={{
          width: "90%",
          overflow: "hidden",
          backgroundColor: "#f5f5f5",
          boxShadow: 5,
          textAlign: "center",
          borderRadius: "0px",
          mt: 2,
          mb: 2,
        }}
      >
        <CardHeader
          avatar={<AdsClickIcon />}
          title={
            <Typography fontWeight="bold" sx={{ fontFamily: "initial" }}>
              RECURSOS COMPONENTE #{componenteID}
            </Typography>
          }
          sx={{
            background: "#0b2f6d",
            color: "white",
            textAlign: "end",
          }}
        />
        <CardContent>
          <Paper>
            <Grid container>
              {elementos && elementos.length > 0 ? (
                elementos.map((row, index) => (
                  <Grid item xs={12} sm={12} lg={12} sx={{ p: 1 }}>
                    <Box key={index}>
                      <Grid item xs={12} sm={12} lg={12} sx={{ p: 1 }}>
                        <Typography
                          fontWeight="bold"
                          sx={{
                            fontWeight: "bold",
                            fontFamily: "initial",
                            background: "#e8e8e8",
                            p: 1,
                          }}
                        >
                          {row.pregunta ? row.pregunta : "Sin informacion"}
                        </Typography>
                      </Grid>
                      <Divider sx={{ mt: 1 }} />
                      <Grid item xs={12} sm={12} lg={12} sx={{ p: 1 }}>
                        <Typography
                          fontWeight="bold"
                          sx={{ fontFamily: "initial" }}
                        >
                          {row.respuesta && row.respuesta
                            ? row.respuesta
                            : "Sin informacion"}
                        </Typography>
                      </Grid>
                      <Divider sx={{ mt: 1 }} />
                      <Grid item xs={12} sm={12} lg={12} sx={{ p: 1 }}>
                        {row.file ? (
                          <Typography
                            fontWeight="bold"
                            sx={{ fontFamily: "initial" }}
                          >
                            <img
                              src={row.file}
                              alt={row.respuesta}
                              style={{ maxHeight: "400px", maxWidth: "400px" }}
                            />
                          </Typography>
                        ) : (
                          <Typography
                            fontWeight="bold"
                            sx={{ fontFamily: "initial" }}
                          >
                            Sin Información
                          </Typography>
                        )}
                      </Grid>
                      <Divider sx={{ mt: 1 }} />
                      <Grid item xs={12} sm={12} lg={12} sx={{ p: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-around",
                          }}
                        >
                          <Tooltip title="Agregar Imagen">
                            <Button
                              variant="contained"
                              sx={{ background: "#0b2f6d", borderRadius: 0 }}
                              onClick={() => {
                                setOpenModal(true);
                                setForm({
                                  ...form,
                                  formComponenteID: row.formComponenteID,
                                });
                                setTitle(row.pregunta);
                              }}
                            >
                              <DataSaverOnIcon />
                            </Button>
                          </Tooltip>
                          <Tooltip title="Eliminar">
                            <Button
                              variant="contained"
                              sx={{ background: "#c62828", borderRadius: 0 }}
                              onClick={() => {
                                setToDelete(row.recursoID),
                                  setOpenModalDelete(true);
                              }}
                            >
                              <DeleteIcon />
                            </Button>
                          </Tooltip>
                        </Box>
                      </Grid>
                    </Box>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12} sm={12} lg={12} sx={{ p: 1 }}>
                  <CircularProgress />
                </Grid>
              )}
            </Grid>
          </Paper>
        </CardContent>
      </Card>
    </>
  );

  const formPowerMetter = () => (
    <>
      {existPowerMetter & !existCTO ? (
        <Card
          sx={{
            width: "90%",
            overflow: "hidden",
            backgroundColor: "#f5f5f5",
            boxShadow: 5,
            textAlign: "center",
            borderRadius: "0px",
            mt: 2,
            mb: 2,
          }}
        >
          <CardHeader
            avatar={<AdsClickIcon />}
            title={
              <Typography fontWeight="bold" sx={{ fontFamily: "initial" }}>
                AGREGA MEDICIONES POWER METTER PARA COMPONENTE #{componenteID}
              </Typography>
            }
            sx={{
              background: "#0b2f6d",
              color: "white",
              textAlign: "end",
            }}
          />
          <CardContent>
            <Paper>
              <form onSubmit={handleSubmitPM}>
                <Box
                  sx={{
                    mb: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Grid
                    container
                    spacing={2}
                    justifyContent="center"
                    sx={{ p: 1 }}
                  >
                    {Array.from({ length: 8 }, (_, i) => (
                      <Grid item xs={12} sm={6} key={i}>
                        <InputLabel id={`respuesta-label-${i + 1}`}>
                          Medida N° {i + 1}
                        </InputLabel>
                        <TextField
                          sx={{
                            whiteSpace: "normal",
                            width: "100%",
                            textAlign: "center",
                            background: "#ffffff",
                          }}
                          fullWidth
                          required
                          id={`value_${i + 1}`}
                          type="number"
                          name={`value_${i + 1}`}
                          variant="outlined"
                          value={formPM[`value_${i + 1}`]}
                          onChange={handleChangePM}
                        />
                      </Grid>
                    ))}
                  </Grid>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    variant="contained"
                    color="error"
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
                    {isSubmitting ? "Procesando..." : "Enviar"}
                  </Button>
                </Box>
              </form>
            </Paper>
          </CardContent>
        </Card>
      ) : null}
    </>
  );

  const medicionCTOViewer = () => (
    <>
      {existPowerMetter & existCTO ? (
        <Card
          sx={{
            width: "90%",
            overflow: "hidden",
            backgroundColor: "#f5f5f5",
            boxShadow: 5,
            textAlign: "center",
            borderRadius: "0px",
            mt: 2,
            mb: 2,
          }}
        >
          <CardHeader
            avatar={<ArticleIcon />}
            title={
              <Typography fontWeight="bold" sx={{ fontFamily: "initial" }}>
                MEDICIONES CTO PARA COMPONENTE #{componenteID}
              </Typography>
            }
            sx={{
              background: "#0b2f6d",
              color: "white",
              textAlign: "end",
            }}
          />
          <CardContent>
            <Grid container spacing={2}>
              {medicionCTO &&
                [
                  { label: "Medición N° 1 :", value: medicionCTO.value_1 },
                  { label: "Medición N° 2 :", value: medicionCTO.value_2 },
                  { label: "Medición N° 3 :", value: medicionCTO.value_3 },
                  { label: "Medición N° 4 :", value: medicionCTO.value_4 },
                  { label: "Medición N° 5 :", value: medicionCTO.value_5 },
                  { label: "Medición N° 6 :", value: medicionCTO.value_6 },
                  { label: "Medición N° 7 :", value: medicionCTO.value_7 },
                  { label: "Medición N° 8 :", value: medicionCTO.value_8 },
                ].map((row, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        borderRadius: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: "bold",
                          fontFamily: "initial",
                          width: "30%",
                          background: "#e8e8e8",
                          p: 1,
                        }}
                      >
                        {row.label}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "initial",
                          color: "text.secondary",
                          width: "70%",
                          p: 1,
                        }}
                      >
                        {row.value || "Sin Información"}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
            </Grid>
          </CardContent>
        </Card>
      ) : null}
    </>
  );
  

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        paddingTop: 8,
        borderRadius: 2,
      }}
    >
      {open && (
        <Alert onClose={handleClose} severity="info" sx={{ marginBottom: 3 }}>
          {message}
        </Alert>
      )}
      {openModal && setModal()}
      {openModalDelete && setModalDelete()}
      <Box
        sx={{
          width: { lg: "70%", xs: "100%", md: "100%" },
          display: "flex",
          flexDirection: "column",
          gap: 4, // Añade espacio entre los elementos
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "start", width: "90%" }}>
          <Link to={`/asignado/${proyectoID}`}>
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
              Volver
            </Button>
          </Link>
        </Box>
        {infoCard()}
        {formCard()}
        {formPowerMetter()}
        {medicionCTOViewer()}
        {cardRecurso()}
      </Box>
    </Box>
  );
}

export default ComponenteAsignadoView;
