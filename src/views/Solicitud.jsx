import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Modal,
  Skeleton,
  Table,
  TableContainer,
  Paper,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Typography,
} from "@mui/material";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUniqueSolicitud } from "../api/solicitudAPI";
import { createNotificacion } from "../api/notificacionesAPI";
import extractDate from "../helpers/main";
import { createSG } from "../api/sgAPI";
import RrhhViewer from "../components/rrhhFormViewer";
import PrevencionViewer from "../components/prevencionFormViewer";
import CalidadViewer from "../components/calidadFormViewer";
import OperacionesViewer from "../components/operacionesFormViewer";
import LogisticaViewer from "../components/logisticaFormViewer";
import FlotaViewer from "../components/flotaFormViewer";

function Solicitud() {
  const { solicitud_id } = useParams();
  const authState = useSelector((state) => state.auth);
  const { token, user_id } = authState;

  const [data, setData] = useState(null);
  const [dataGestiones, setDataGestiones] = useState(null);
  const [dataForm, setDataForm] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const [logID, setLogID] = useState(undefined);
  const [estadoID, setEstadoID] = useState(undefined);

  // SET MODALES
  const [openModalAprobar, setOpenModalAprobar] = useState(false);
  const [openModalRechazar, setOpenModalRechazar] = useState(false);
  const [openModalLegal, setOpenModalLegal] = useState(false);
  const [openModalEmpleador, setOpenModalEmpleador] = useState(false);
  const [openModalTrabajador, setOpenModalTrabajador] = useState(false);
  const [openModalLicencia, setOpenModalLicencia] = useState(false);
  const [openModalVacaciones, setOpenModalVacaciones] = useState(false);
  const [openModalFirmada, setOpenModalFirmada] = useState(false);
  const [openModalNoFirmada, setOpenModalNoFirmada] = useState(false);
  const [openModalCorreo, setOpenModalCorreo] = useState(false);

  // VARIABLE CON ID DEL USUARIO CREADOR DE LA SOLICITUD
  const [validate, setValidate] = useState(undefined);

  const [toNotif, setToNotif] = useState(undefined)


  const [notificacion, setNotificacion] = useState({
    nav_path: "",
    descri: "",
    userID: toNotif || ""
  });

  const title = `SOLICITUD DE AMONESTACIÓN N° ${solicitud_id}`;
  const tableTitle = `REGISTRO DE GESTIONES`;

  // MODALES

  const setModalRechazar = () => (
    <>
      <Modal open={openModalRechazar} onClose={handleCloseModal}>
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
              fontFamily="monospace"
              sx={{ pt: 2 }}
            >
              ¿Quieres Anular esta Amonestación?
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", pt: 2 }}>
            <Button
              variant="contained"
              onClick={gestionarSolicitud}
              color="error"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Procesando..." : "Aceptar"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );

  const setModalAprobar = () => (
    <>
      <Modal open={openModalAprobar} onClose={handleCloseModal}>
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
              fontFamily="monospace"
              sx={{ pt: 2 }}
            >
              ¿Quieres Aprobar esta Amonestación?
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", pt: 2 }}>
            <Button
              variant="contained"
              onClick={gestionarSolicitud}
              color="error"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Procesando..." : "Aceptar"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );

  const setModalLegal = () => (
    <>
      <Modal open={openModalLegal} onClose={handleCloseModal}>
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
              fontFamily="monospace"
              sx={{ pt: 2 }}
            >
              ¿Quieres definir como Pendiente de Evaluación Legal?
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", pt: 2 }}>
            <Button
              variant="contained"
              onClick={gestionarSolicitud}
              color="error"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Procesando..." : "Aceptar"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );

  const setModalEmpleador = () => (
    <>
      <Modal open={openModalEmpleador} onClose={handleCloseModal}>
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
              fontFamily="monospace"
              sx={{ pt: 2 }}
            >
              ¿Quieres definir como Pendiente de Firma Empleador?
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", pt: 2 }}>
            <Button
              variant="contained"
              onClick={gestionarSolicitud}
              color="error"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Procesando..." : "Aceptar"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );

  const setModalTrabajador = () => (
    <>
      <Modal open={openModalTrabajador} onClose={handleCloseModal}>
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
              fontFamily="monospace"
              sx={{ pt: 2 }}
            >
              ¿Quieres definir como Pendiente de Firma Trabajador?
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", pt: 2 }}>
            <Button
              variant="contained"
              onClick={gestionarSolicitud}
              color="error"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Procesando..." : "Aceptar"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );

  const setModalLicencia = () => (
    <>
      <Modal open={openModalLicencia} onClose={handleCloseModal}>
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
              fontFamily="monospace"
              sx={{ pt: 2 }}
            >
              ¿Quieres definir como Trabajador con Licencia?
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", pt: 2 }}>
            <Button
              variant="contained"
              onClick={gestionarSolicitud}
              color="error"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Procesando..." : "Aceptar"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );

  const setModalVacaciones = () => (
    <>
      <Modal open={openModalVacaciones} onClose={handleCloseModal}>
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
              fontFamily="monospace"
              sx={{ pt: 2 }}
            >
              ¿Quieres definir como Trabajador con Vacaciones?
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", pt: 2 }}>
            <Button
              variant="contained"
              onClick={gestionarSolicitud}
              color="error"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Procesando..." : "Aceptar"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );

  const setModalFirmada = () => (
    <>
      <Modal open={openModalFirmada} onClose={handleCloseModal}>
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
              fontFamily="monospace"
              sx={{ pt: 2 }}
            >
              ¿Quieres definir como Firmada por el Trabajador?
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", pt: 2 }}>
            <Button
              variant="contained"
              onClick={gestionarSolicitud}
              color="error"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Procesando..." : "Aceptar"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );

  const setModalNoFirmada = () => (
    <>
      <Modal open={openModalNoFirmada} onClose={handleCloseModal}>
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
              fontFamily="monospace"
              sx={{ pt: 2 }}
            >
              ¿Quieres definir como No Firmada por el Trabajador?
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", pt: 2 }}>
            <Button
              variant="contained"
              onClick={gestionarSolicitud}
              color="error"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Procesando..." : "Aceptar"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );

  const setModalCorreo = () => (
    <>
      <Modal open={openModalCorreo} onClose={handleCloseModal}>
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
              fontFamily="monospace"
              sx={{ pt: 2 }}
            >
              ¿Quieres definir como Enviada por Correo?
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", pt: 2 }}>
            <Button
              variant="contained"
              onClick={gestionarSolicitud}
              color="error"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Procesando..." : "Aceptar"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );

  // BOTONES DE ACCION PARA MODALES

  const btnAprobar = () => (
    <>
      <Button
        variant="contained"
        color="info"
        onClick={() => {
          setEstadoID(2);
          setOpenModalAprobar(true);
          setToNotif(3)
        }}
      >
        <Typography fontFamily="monospace">APROBAR AMONESTACION</Typography>
      </Button>
    </>
  );
  const btnRechazar = () => (
    <>
      <Button
        variant="contained"
        color="error"
        onClick={() => {
          setEstadoID(9);
          setOpenModalAprobar(true);
          setToNotif(validate)
        }}
      >
        <Typography fontFamily="monospace">ANULAR AMONESTACION</Typography>
      </Button>
    </>
  );
  const btnRequiereLegal = () => (
    <>
      <Button
        variant="contained"
        color="info"
        onClick={() => {
          setEstadoID(3);
          setOpenModalLegal(true);
          setToNotif(3)
        }}
      >
        <Typography fontFamily="monospace">REQUIERE LEGAL</Typography>
      </Button>
    </>
  );
  const btnFirmaEmpleador = () => (
    <>
      <Button
        variant="contained"
        color="error"
        onClick={() => {
          setEstadoID(4);
          setOpenModalEmpleador(true);
          setToNotif(3)
        }}
      >
        <Typography fontFamily="monospace">FIRMA EMPLEADOR</Typography>
      </Button>
    </>
  );
  const btnFirmaTrabajador = () => (
    <>
      <Button
        variant="contained"
        color="info"
        onClick={() => {
          setEstadoID(7);
          setOpenModalTrabajador(true);
          setToNotif(validate)
        }}
        sx={{ width: "200px" }}
      >
        <Typography fontFamily="monospace">FIRMA TRABAJADOR</Typography>
      </Button>
    </>
  );
  const btnLicenciaMedica = () => (
    <>
      <Button
        variant="contained"
        color="error"
        onClick={() => {
          setEstadoID(5);
          setOpenModalLicencia(true);
          setToNotif(3)
        }}
        sx={{ width: "200px" }}
      >
        <Typography fontFamily="monospace">LICENCIA MEDICA</Typography>
      </Button>
    </>
  );
  const btnVacaciones = () => (
    <>
      <Button
        variant="contained"
        color="success"
        onClick={() => {
          setEstadoID(6);
          setOpenModalVacaciones(true);
          setToNotif(3)
        }}
        sx={{ width: "200px" }}
      >
        <Typography fontFamily="monospace">VACACIONES</Typography>
      </Button>
    </>
  );
  const btnEnviadaCorreo = () => (
    <>
      <Button
        variant="contained"
        color="info"
        onClick={() => {
          setEstadoID(13);
          setOpenModalCorreo(true);
          setToNotif(validate)
        }}
        sx={{ width: "200px" }}
      >
        <Typography fontFamily="monospace">ENVIADA POR CORREO</Typography>
      </Button>
    </>
  );
  const btnFirmada = () => (
    <>
      <Button
        variant="contained"
        color="info"
        onClick={() => {
          setEstadoID(10);
          setOpenModalFirmada(true);
          setToNotif(validate)
        }}
        sx={{ width: "200px" }}
      >
        <Typography fontFamily="monospace">FIRMADA</Typography>
      </Button>
    </>
  );
  const btnNoFirmada = () => (
    <>
      <Button
        variant="contained"
        color="error"
        onClick={() => {
          setEstadoID(12);
          setOpenModalNoFirmada(true);
          setToNotif(3)
        }}
        sx={{ width: "200px" }}
      >
        <Typography fontFamily="monospace">NO FIRMA</Typography>
      </Button>
    </>
  );

  // BTN GROUP

  const componenteAprobacion = () => (
    <Card
      sx={{
        width: "100%",
        maxWidth: "800px",
        overflow: "hidden",
        backgroundColor: "#f5f5f5",
        boxShadow: 5,
        borderRadius: "0",
        mt: 3,
      }}
    >
      <CardHeader
        title={
          <Typography fontWeight="bold" sx={{ fontFamily: "monospace" }}>
            ACCIONES
          </Typography>
        }
        sx={{
          background: "#0b2f6d",
          color: "white",
          textAlign: "start",
        }}
      />
      <CardContent sx={{ display: "flex", justifyContent: "space-evenly" }}>
        {btnAprobar()}

        {btnRechazar()}
      </CardContent>
    </Card>
  );

  const componenteRequiereLegal = () => (
    <Card
      sx={{
        width: "100%",
        maxWidth: "800px",
        overflow: "hidden",
        backgroundColor: "#f5f5f5",
        boxShadow: 5,
        borderRadius: "0",
        mt: 3,
      }}
    >
      <CardHeader
        title={
          <Typography fontWeight="bold" sx={{ fontFamily: "monospace" }}>
            ACCIONES
          </Typography>
        }
        sx={{
          background: "#0b2f6d",
          color: "white",
          textAlign: "start",
        }}
      />
      <CardContent sx={{ display: "flex", justifyContent: "space-evenly" }}>
        {btnRequiereLegal()}

        {btnFirmaEmpleador()}
      </CardContent>
    </Card>
  );

  const componenteRequiereEmpleador = () => (
    <Card
      sx={{
        width: "100%",
        maxWidth: "800px",
        overflow: "hidden",
        backgroundColor: "#f5f5f5",
        boxShadow: 5,
        borderRadius: "0",
        mt: 3,
      }}
    >
      <CardHeader
        title={
          <Typography fontWeight="bold" sx={{ fontFamily: "monospace" }}>
            ACCIONES
          </Typography>
        }
        sx={{
          background: "#0b2f6d",
          color: "white",
          textAlign: "start",
        }}
      />
      <CardContent sx={{ display: "flex", justifyContent: "space-evenly" }}>
        {btnFirmaEmpleador()}
      </CardContent>
    </Card>
  );

  const componenteOperativo = () => (
    <Card
      sx={{
        width: "100%",
        maxWidth: "800px",
        overflow: "hidden",
        backgroundColor: "#f5f5f5",
        boxShadow: 5,
        borderRadius: "0",
        mt: 3,
      }}
    >
      <CardHeader
        title={
          <Typography fontWeight="bold" sx={{ fontFamily: "monospace" }}>
            ACCIONES
          </Typography>
        }
        sx={{
          background: "#0b2f6d",
          color: "white",
          textAlign: "start",
        }}
      />
      <CardContent sx={{ display: "flex", justifyContent: "space-evenly" }}>
        {btnFirmaTrabajador()}
        {btnLicenciaMedica()}
        {btnVacaciones()}
      </CardContent>
    </Card>
  );

  const componenteLicencia = () => (
    <Card
      sx={{
        width: "100%",
        maxWidth: "800px",
        overflow: "hidden",
        backgroundColor: "#f5f5f5",
        boxShadow: 5,
        borderRadius: "0",
        mt: 3,
      }}
    >
      <CardHeader
        title={
          <Typography fontWeight="bold" sx={{ fontFamily: "monospace" }}>
            ACCIONES
          </Typography>
        }
        sx={{
          background: "#0b2f6d",
          color: "white",
          textAlign: "start",
        }}
      />
      <CardContent sx={{ display: "flex", justifyContent: "space-evenly" }}>
        {btnFirmaTrabajador()}
        {btnVacaciones()}
      </CardContent>
    </Card>
  );

  const componenteVacaciones = () => (
    <Card
      sx={{
        width: "100%",
        maxWidth: "800px",
        overflow: "hidden",
        backgroundColor: "#f5f5f5",
        boxShadow: 5,
        borderRadius: "0",
        mt: 3,
      }}
    >
      <CardHeader
        title={
          <Typography fontWeight="bold" sx={{ fontFamily: "monospace" }}>
            ACCIONES
          </Typography>
        }
        sx={{
          background: "#0b2f6d",
          color: "white",
          textAlign: "start",
        }}
      />
      <CardContent sx={{ display: "flex", justifyContent: "space-evenly" }}>
        {btnFirmaTrabajador()}
        {btnLicenciaMedica()}
      </CardContent>
    </Card>
  );

  const componenteNoFirmada = () => (
    <Card
      sx={{
        width: "100%",
        maxWidth: "800px",
        overflow: "hidden",
        backgroundColor: "#f5f5f5",
        boxShadow: 5,
        borderRadius: "0",
        mt: 3,
      }}
    >
      <CardHeader
        title={
          <Typography fontWeight="bold" sx={{ fontFamily: "monospace" }}>
            ACCIONES
          </Typography>
        }
        sx={{
          background: "#0b2f6d",
          color: "white",
          textAlign: "start",
        }}
      />
      <CardContent sx={{ display: "flex", justifyContent: "space-evenly" }}>
        {btnEnviadaCorreo()}
      </CardContent>
    </Card>
  );

  const componenteFirmada = () => (
    <Card
      sx={{
        width: "100%",
        maxWidth: "800px",
        overflow: "hidden",
        backgroundColor: "#f5f5f5",
        boxShadow: 5,
        borderRadius: "0",
        mt: 3,
      }}
    >
      <CardHeader
        title={
          <Typography fontWeight="bold" sx={{ fontFamily: "monospace" }}>
            ACCIONES
          </Typography>
        }
        sx={{
          background: "#0b2f6d",
          color: "white",
          textAlign: "start",
        }}
      />
      <CardContent sx={{ display: "flex", justifyContent: "space-evenly" }}>
        {btnFirmada()}
        {btnNoFirmada()}
      </CardContent>
    </Card>
  );

  // FUNCIONES DESDE AQUI

  const gestionarSolicitud = async (e) => {
    e.preventDefault();
    
    const formAnulacion = { logID, solicitudEstadoID: estadoID };
    const { nav_path, descri, userID } = notificacion;
  
    try {
      // Crear solicitud de gestión
      const response = await createSG(formAnulacion, token);
      
      // Crear notificación después de la solicitud de gestión
      await createNotificacion({ nav_path, descri, userID }, token);
      
      // Actualizar mensaje y abrir diálogo de éxito
      setMessage(response.message || "Gestión creada exitosamente.");
      setOpen(true);
      
      // Refrescar datos y cerrar modales al terminar
      fetchData();
      handleCloseModal();
    } catch (error) {
      // Manejo de errores más específico para depuración y UX
      console.error("Error al gestionar la solicitud:", error);
      setMessage("Error al crear la gestión. Inténtalo nuevamente.");
      setOpen(true);
      handleCloseModal();
    }
  };
  

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseModal = () => {
    setOpenModalAprobar(false);
    setOpenModalRechazar(false);
    setOpenModalLegal(false);
    setOpenModalEmpleador(false);
    setOpenModalTrabajador(false);
    setOpenModalLicencia(false);
    setOpenModalVacaciones(false);
    setOpenModalFirmada(false);
    setOpenModalNoFirmada(false);
    setOpenModalCorreo(false);
  };

  const fetchData = async () => {
    try {
      const res = await getUniqueSolicitud(token, solicitud_id);
      setData(res);
      setValidate(res.userID);
      setDataGestiones(res.gestiones);
      setDataForm(res.form);
      setLogID(res.logID);
      setIsLoading(false);
      setIsSubmitting(false);
    } catch (error) {
      setMessage("Error al cargar la información");
      setOpen(true);
    }
  };

  // COMPONENTES GENERALES DESDE AQUI

  const setTableEstado = () => (
    <>
      <CardContent>
        <TableContainer
          component={Paper}
          sx={{ width: "100%", height: "100%" }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{ background: "#d8d8d8", fontWeight: "bold" }}
                  align="center"
                >
                  <Typography fontFamily="monospace">FECHA</Typography>
                </TableCell>
                <TableCell
                  sx={{ background: "#d8d8d8", fontWeight: "bold" }}
                  align="center"
                >
                  <Typography fontFamily="monospace">ESTADO</Typography>
                </TableCell>
                <TableCell
                  sx={{ background: "#d8d8d8", fontWeight: "bold" }}
                  align="center"
                >
                  <Typography fontFamily="monospace">GESTIONADO POR</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataGestiones && dataGestiones.length > 0 ? (
                dataGestiones.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">
                      <Typography fontFamily="monospace">
                        {extractDate(row.fecha)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography fontFamily="monospace">
                        {row.estado}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography fontFamily="monospace">
                        {row.responsable}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    <Typography fontFamily="monospace">
                      Sin gestiones registradas
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </>
  );

  const setFormViewer = () => {
    if (data?.form !== "None") {
      switch (data.areaID) {
        case 1:
          return <PrevencionViewer data={data.form} />;
        case 2:
          return <CalidadViewer data={data.form} />;
        case 3:
          return <OperacionesViewer data={data.form} />;
        case 4:
          return <LogisticaViewer data={data.form} />;
        case 5:
          return <RrhhViewer data={data.form} />;
        case 6:
          return <FlotaViewer data={data.form} />;
        default:
          null;
      }
    } else {
      null;
    }
  };

  const setDetallesView = () => (
    <>
      <CardContent sx={{ p: 4 }}>
        {dataForm !== false && dataForm !== null ? (
          setFormViewer()
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              variant="body1"
              component="div"
              sx={{ color: "text.secondary", pb: 6, fontFamily: "monospace" }}
            >
              Sin información
            </Typography>
            <Link to={`/${data.area}/${data.logID}`}>
              <Button variant="contained" sx={{ background: "#0b2f6d" }}>
                Crear Formulario
              </Button>
            </Link>
          </Box>
        )}
      </CardContent>
    </>
  );

  const setSolicitudView = () => (
    <>
      <CardContent sx={{ p: 4 }}>
        {[
          { label: "Fecha Solicitud :", value: data.fechaSolicitud },
          { label: "Solicitante :", value: data.solicitante },
          { label: "Rut Solicitante :", value: data.rutSolicitante },
          { label: "Tipo Formulario :", value: data.area },
          { label: "Motivo :", value: data.motivo },
          { label: "Submotivo :", value: data.submotivo },
          { label: "Amonestado :", value: data.amonestado },
          {
            label: "Rut Amonestado :",
            value: data.rutAmonestado,
          },
        ].map((item, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              component="div"
              sx={{ fontWeight: "bold", fontFamily: "monospace" }}
            >
              {item.label}
            </Typography>
            <Typography
              variant="h6"
              component="div"
              sx={{ color: "text.secondary", pl: 1, fontFamily: "monospace" }}
            >
              {item.value}
            </Typography>
          </Box>
        ))}
      </CardContent>
    </>
  );

  // USEEFFECTS DESDE AQUI

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (data && data !== null) {
      setNotificacion({
        nav_path: `/solicitud/${solicitud_id}`,
        descri: `Tienes una nueva actualización para la amonestación con folio N° ${solicitud_id}`,
        userID: "",
      });
    }
  }, [data]);

  useEffect(() => {
    setNotificacion((prevNotificacion) => ({
      ...prevNotificacion,
      userID: toNotif || ""
    }));
  }, [toNotif]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "85vh",
        overflow: "auto",
        padding: 8,
      }}
    >
      {/* COMPONENTE MODAL PARA APROBAR AMONESTACION */}
      {openModalAprobar && setModalAprobar()}

      {/* COMPONENTE MODAL PARA RECHAZAR AMONESTACION */}
      {openModalRechazar && setModalRechazar()}

      {/* COMPONENTE MODAL PARA DEFINIR COMO PENDIENTE DE EVALUACION LEGAL */}
      {openModalLegal && setModalLegal()}

      {/* COMPONENTE MODAL PARA DEFINIR COMO PENDIENTE DE FIRMA EMPLEADOR */}
      {openModalEmpleador && setModalEmpleador()}

      {/* COMPONENTE MODAL PARA DEFINIR COMO PENDIENTE DE FIRMA TRABAJADOR */}
      {openModalTrabajador && setModalTrabajador()}

      {/* COMPONENTE MODAL PARA DEFINIR COMO TRABAJADOR CON LICENCIA */}
      {openModalLicencia && setModalLicencia()}

      {/* COMPONENTE MODAL PARA DEFINIR COMO TRABAJADOR CON VACACIONES */}
      {openModalVacaciones && setModalVacaciones()}

      {/* COMPONENTE MODAL PARA DEFINIR COMO FIRMADA */}
      {openModalFirmada && setModalFirmada()}

      {/* COMPONENTE MODAL PARA DEFINIR COMO NO FIRMADA */}
      {openModalNoFirmada && setModalNoFirmada()}

      {/* COMPONENTE MODAL PARA DEFINIR COMO ENVIADA POR CORREO */}
      {openModalCorreo && setModalCorreo()}

      {/* COMPONENTE DE ALERTA */}
      {open && (
        <Alert
          onClose={handleClose}
          severity="error"
          sx={{ mb: 3, width: "90%" }}
        >
          {message}
        </Alert>
      )}

      {isLoading ? (
        <Box
          sx={{
            width: "100%",
            height: "90vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Skeleton
            variant="rounded"
            width={"800px"}
            height={"70%"}
            sx={{ p: 3, m: 3 }}
          />
        </Box>
      ) : (
        <>
          <Box
            sx={{
              width: "90%",
              maxWidth: "800px",
              overflow: "hidden",
              borderRadius: "0",
              mt: 3,
            }}
          >
            <Link to="/solicitudes">
              <Button variant="contained" sx={{ background: "#0b2f6d" }}>
                Ir a Solicitudes
              </Button>
            </Link>
          </Box>
          <Card
            sx={{
              width: "90%",
              maxWidth: "800px",
              overflow: "hidden",
              backgroundColor: "#f5f5f5",
              boxShadow: 5,
              borderRadius: "0",
              mt: 3,
            }}
          >
            <CardHeader
              title={
                <Typography fontWeight="bold" sx={{ fontFamily: "monospace" }}>
                  {title}
                </Typography>
              }
              sx={{
                background: "#0b2f6d",
                color: "white",
                textAlign: "start",
              }}
            />

            {setSolicitudView()}

            <CardHeader
              title={
                <Typography fontWeight="bold" sx={{ fontFamily: "monospace" }}>
                  DETALLES
                </Typography>
              }
              sx={{
                background: "#0b2f6d",
                color: "white",
                textAlign: "start",
              }}
            />

            {setDetallesView()}

            <CardHeader
              title={
                <Typography fontWeight="bold" sx={{ fontFamily: "monospace" }}>
                  {tableTitle}
                </Typography>
              }
              sx={{
                background: "#0b2f6d",
                color: "white",
                textAlign: "start",
              }}
            />
            {setTableEstado()}
          </Card>

          {/* BOX PARA APROBAR O RECHAZAR AMONESTACIONES */}
          <Box sx={{ width: "800px" }}>
            {(user_id == 4) &
            (dataGestiones[0].estado == "PENDIENTE DE APROBACION")
              ? componenteAprobacion()
              : null}
          </Box>

          {/* BOX PARA EVALUACION LEGAL */}
          <Box sx={{ width: "800px" }}>
            {(user_id == 3) & (dataGestiones[0].estado == "ENVIADA A RRHH")
              ? componenteRequiereLegal()
              : null}
          </Box>

          {/* BOX PARA EVALUACION LEGAL */}
          <Box sx={{ width: "800px" }}>
            {(user_id == 3) & (dataGestiones[0].estado == "EVALUACION LEGAL")
              ? componenteRequiereEmpleador()
              : null}
          </Box>

          {/* BOX PARA DEFINIR ESTADO DE TRABAJADOR */}
          <Box sx={{ width: "800px" }}>
            {(user_id == 3) &
            (dataGestiones[0].estado == "PENDIENTE FIRMA EMPLEADOR")
              ? componenteOperativo()
              : null}
          </Box>

          {/* BOX PARA DEFINIR ESTADO DE TRABAJADOR */}
          <Box sx={{ width: "800px" }}>
            {(user_id == 3) & (dataGestiones[0].estado == "LICENCIA MEDICA")
              ? componenteLicencia()
              : null}
          </Box>

          {/* BOX PARA DEFINIR ESTADO DE TRABAJADOR */}
          <Box sx={{ width: "800px" }}>
            {(user_id == 3) & (dataGestiones[0].estado == "VACACIONES")
              ? componenteVacaciones()
              : null}
          </Box>

          {/* BOX PARA DEFINIR ESTADO DE FIRMA */}
          <Box sx={{ width: "800px" }}>
            {(user_id == validate) &
            (dataGestiones[0].estado == "PENDIENTE FIRMA TRABAJADOR")
              ? componenteFirmada()
              : null}
          </Box>

          {/* BOX PARA DEFINIR ESTADO DE NO FIRMADA */}
          <Box sx={{ width: "800px" }}>
            {(user_id == 3) & (dataGestiones[0].estado == "NO FIRMADA")
              ? componenteNoFirmada()
              : null}
          </Box>
        </>
      )}
    </Box>
  );
}

export default Solicitud;
