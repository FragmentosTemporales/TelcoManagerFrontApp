import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  InputLabel,
  Modal,
  Skeleton,
  Table,
  TableContainer,
  Paper,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TextField,
  Typography,
} from "@mui/material";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUniqueSolicitud, createFolio } from "../api/solicitudAPI";
import extractDate from "../helpers/main";
import { createSG } from "../api/sgAPI";
import RrhhViewer from "../components/rrhhFormViewer";
import PrevencionViewer from "../components/prevencionFormViewer";
import CalidadViewer from "../components/calidadFormViewer";
import OperacionesViewer from "../components/operacionesFormViewer";
import LogisticaViewer from "../components/logisticaFormViewer";
import FlotaViewer from "../components/flotaFormViewer";
import { downloadFile } from "../api/downloadApi";

function Solicitud() {
  const { solicitud_id } = useParams();
  const authState = useSelector((state) => state.auth);
  const { token, user_id, area } = authState;
  const filePath = "/home/ubuntu/telcomanager/app/data/Formato.docx";

  const [data, setData] = useState(null);
  const [dataGestiones, setDataGestiones] = useState(null);
  const [dataForm, setDataForm] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const [alertInfo, setAlertInfo] = useState("error");

  const [logID, setLogID] = useState(undefined);
  const [estadoID, setEstadoID] = useState(undefined);

  // SET MODALES
  const [openModalFinalizar, setOpenModalFinalizar] = useState(false);
  const [openModalRechazar, setOpenModalRechazar] = useState(false);
  const [openModalLegal, setOpenModalLegal] = useState(false);
  const [openModalDesvinculado, setOpenModalDesvinculado] = useState(false);
  const [openModalEmpleador, setOpenModalEmpleador] = useState(false);
  const [openModalTrabajador, setOpenModalTrabajador] = useState(false);
  const [openModalLicencia, setOpenModalLicencia] = useState(false);
  const [openModalVacaciones, setOpenModalVacaciones] = useState(false);
  const [openModalFirmada, setOpenModalFirmada] = useState(false);
  const [openModalNoFirmada, setOpenModalNoFirmada] = useState(false);
  const [openModalCorreo, setOpenModalCorreo] = useState(false);

  // VARIABLE CON ID DEL USUARIO CREADOR DE LA SOLICITUD
  const [validate, setValidate] = useState(undefined);

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
            borderRadius: 2,
          }}
        >
          <Box sx={{ textAlign: "center", pb: 2 }}>
            <Typography
              variant="h5"
              fontWeight="bold"
              fontFamily="initial"
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
              sx={{ borderRadius: 2 }}
            >
              {isSubmitting ? "Procesando..." : "Aceptar"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );

  const setModalFinalizar = () => (
    <>
      <Modal open={openModalFinalizar} onClose={handleCloseModal}>
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
            borderRadius: 2,
          }}
        >
          <Box sx={{ textAlign: "center", pb: 2 }}>
            <Typography
              variant="h5"
              fontWeight="bold"
              fontFamily="initial"
              sx={{ pt: 2 }}
            >
              ¿Quieres Finalizar esta Amonestación?
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", pt: 2 }}>
            <Button
              variant="contained"
              onClick={gestionarSolicitud}
              color="error"
              disabled={isSubmitting}
              sx={{ borderRadius: 2 }}
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
            borderRadius: 2,
          }}
        >
          <Box sx={{ textAlign: "center", pb: 2 }}>
            <Typography
              variant="h5"
              fontWeight="bold"
              fontFamily="initial"
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
              sx={{ borderRadius: 2 }}
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
            borderRadius: 2,
          }}
        >
          <Box sx={{ textAlign: "center", pb: 2 }}>
            <Typography
              variant="h5"
              fontWeight="bold"
              fontFamily="initial"
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
              sx={{ borderRadius: 2 }}
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
            borderRadius: 2,
          }}
        >
          <Box sx={{ textAlign: "center", pb: 2 }}>
            <Typography
              variant="h5"
              fontWeight="bold"
              fontFamily="initial"
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
              sx={{ width: "200px", borderRadius: 2 }}
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
            borderRadius: 2,
          }}
        >
          <Box sx={{ textAlign: "center", pb: 2 }}>
            <Typography
              variant="h5"
              fontWeight="bold"
              fontFamily="initial"
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
              sx={{ width: "200px", borderRadius: 2 }}
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
            borderRadius: 2,
          }}
        >
          <Box sx={{ textAlign: "center", pb: 2 }}>
            <Typography
              variant="h5"
              fontWeight="bold"
              fontFamily="initial"
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
              sx={{ width: "200px", borderRadius: 2 }}
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
            borderRadius: 2,
          }}
        >
          <Box sx={{ textAlign: "center", pb: 2 }}>
            <Typography
              variant="h5"
              fontWeight="bold"
              fontFamily="initial"
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
              sx={{ width: "200px", borderRadius: 2 }}
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
            borderRadius: 2,
          }}
        >
          <Box sx={{ textAlign: "center", pb: 2 }}>
            <Typography
              variant="h5"
              fontWeight="bold"
              fontFamily="initial"
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
              sx={{ width: "200px", borderRadius: 2 }}
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
            borderRadius: 2,
          }}
        >
          <Box sx={{ textAlign: "center", pb: 2 }}>
            <Typography
              variant="h5"
              fontWeight="bold"
              fontFamily="initial"
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
              sx={{ width: "200px", borderRadius: 2 }}
            >
              {isSubmitting ? "Procesando..." : "Aceptar"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );

  const setModalDesvinculado = () => (
    <>
      <Modal open={openModalDesvinculado} onClose={handleCloseModal}>
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
            borderRadius: 2,
          }}
        >
          <Box sx={{ textAlign: "center", pb: 2 }}>
            <Typography
              variant="h5"
              fontWeight="bold"
              fontFamily="initial"
              sx={{ pt: 2 }}
            >
              ¿Quieres definir como Trabajador Desvinculado?
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", pt: 2 }}>
            <Button
              variant="contained"
              onClick={gestionarSolicitud}
              color="error"
              disabled={isSubmitting}
              sx={{ borderRadius: 2 }}
            >
              {isSubmitting ? "Procesando..." : "Aceptar"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );

  // BOTONES DE ACCION PARA MODALES

  const btnFinalizar = () => (
    <>
      <Button
        variant="contained"
        color="info"
        onClick={() => {
          setEstadoID(14);
          setOpenModalFinalizar(true);
        }}
        disabled={isSubmitting}
        sx={{ borderRadius: 2 }}
      >
        {isSubmitting ? "Procesando..." : "Finalizar Amonestación"}
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
          setOpenModalRechazar(true);
        }}
        sx={{ borderRadius: 2 }}
      >
        {isSubmitting ? "Procesando..." : "Anular Amonestación"}
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
        }}
        sx={{ borderRadius: 2 }}
      >
        {isSubmitting ? "Procesando..." : "Requiere Legal"}
      </Button>
    </>
  );

  const btnDesvinculado = () => (
    <>
      <Button
        variant="contained"
        color="info"
        onClick={() => {
          setEstadoID(15);
          setOpenModalDesvinculado(true);
        }}
        sx={{ borderRadius: 2 }}
      >
        {isSubmitting ? "Procesando..." : "Trabajador Desvinculado"}
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
        }}
        sx={{ borderRadius: 2 }}
      >
        {isSubmitting ? "Procesando..." : "Firma Empleador"}
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
        }}
        sx={{ width: "200px", borderRadius: 2 }}
      >
        {isSubmitting ? "Procesando..." : "Firma Trabajador"}
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
        }}
        sx={{ width: "200px", borderRadius: 2 }}
      >
        {isSubmitting ? "Procesando..." : "Licencia Médica"}
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
        }}
        sx={{ width: "200px", borderRadius: 2 }}
      >
        {isSubmitting ? "Procesando..." : "Vacaciones"}
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
        }}
        sx={{ width: "200px", borderRadius: 2 }}
      >
        {isSubmitting ? "Procesando..." : "Enviada por Correo"}
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
        }}
        sx={{ width: "200px", borderRadius: 2 }}
      >
        {isSubmitting ? "Procesando..." : "Firmada"}
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
        }}
        sx={{ width: "200px", borderRadius: 2 }}
      >
        {isSubmitting ? "Procesando..." : "No Firmada"}
      </Button>
    </>
  );

  // BTN GROUP

  const componenteAnulacion = () => (
    <Card
      sx={{
        width: "80%",
        overflow: "hidden",
        backgroundColor: "#f5f5f5",
        boxShadow: 5,
        borderRadius: 2,
        mt: 3,
        mx: "auto",
      }}
    >
      <CardHeader
        title={
          <Typography>
            ACCIONES
          </Typography>
        }
        sx={{
          background: "#142a3d",
          color: "white",
          textAlign: "start",
        }}
      />
      <CardContent sx={{ display: "flex", justifyContent: "space-evenly" }}>
        {btnRechazar()}
      </CardContent>
    </Card>
  );

  const componenteRequiereLegal = () => (
    <Card
      sx={{
        width: "80%",
        overflow: "hidden",
        backgroundColor: "#f5f5f5",
        boxShadow: 5,
        borderRadius: 2,
        mt: 3,
        mx: "auto",
      }}
    >
      <CardHeader
        title={
          <Typography>
            ACCIONES
          </Typography>
        }
        sx={{
          background: "#142a3d",
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

  const componenteDesvinculado = () => (
    <Card
      sx={{
        width: "80%",
        overflow: "hidden",
        backgroundColor: "#f5f5f5",
        boxShadow: 5,
        borderRadius: 2,
        mt: 3,
        mx: "auto",
      }}
    >
      <CardHeader
        title={
          <Typography>
            ACCIONES
          </Typography>
        }
        sx={{
          background: "#142a3d",
          color: "white",
          textAlign: "start",
        }}
      />
      <CardContent sx={{ display: "flex", justifyContent: "space-evenly" }}>
        {btnDesvinculado()}
      </CardContent>
    </Card>
  );

  const componenteRequiereEmpleador = () => (
    <Card
      sx={{
        width: "80%",
        overflow: "hidden",
        backgroundColor: "#f5f5f5",
        boxShadow: 5,
        borderRadius: 2,
        mt: 3,
        mx: "auto",
      }}
    >
      <CardHeader
        title={
          <Typography>
            ACCIONES
          </Typography>
        }
        sx={{
          background: "#142a3d",
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
        width: "80%",
        overflow: "hidden",
        backgroundColor: "#f5f5f5",
        boxShadow: 5,
        borderRadius: 2,
        mt: 3,
        mx: "auto",
      }}
    >
      <CardHeader
        title={
          <Typography>
            ACCIONES
          </Typography>
        }
        sx={{
          background: "#142a3d",
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
        width: "80%",
        overflow: "hidden",
        backgroundColor: "#f5f5f5",
        boxShadow: 5,
        borderRadius: 2,
        mt: 3,
        mx: "auto",
      }}
    >
      <CardHeader
        title={
          <Typography>
            ACCIONES
          </Typography>
        }
        sx={{
          background: "#142a3d",
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
        width: "80%",
        overflow: "hidden",
        backgroundColor: "#f5f5f5",
        boxShadow: 5,
        borderRadius: 2,
        mt: 3,
        mx: "auto",
      }}
    >
      <CardHeader
        title={
          <Typography>
            ACCIONES
          </Typography>
        }
        sx={{
          background: "#142a3d",
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
        width: "80%",
        overflow: "hidden",
        backgroundColor: "#f5f5f5",
        boxShadow: 5,
        borderRadius: 2,
        mt: 3,
        mx: "auto",
      }}
    >
      <CardHeader
        title={
          <Typography>
            ACCIONES
          </Typography>
        }
        sx={{
          background: "#142a3d",
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
        width: "80%",
        overflow: "hidden",
        backgroundColor: "#f5f5f5",
        boxShadow: 5,
        borderRadius: 2,
        mt: 3,
        mx: "auto",
      }}
    >
      <CardHeader
        title={
          <Typography>
            ACCIONES
          </Typography>
        }
        sx={{
          background: "#142a3d",
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

  const componenteFinalizada = () => (
    <Card
      sx={{
        width: "80%",
        overflow: "hidden",
        backgroundColor: "#f5f5f5",
        boxShadow: 5,
        borderRadius: 2,
        mt: 3,
        mx: "auto",
      }}
    >
      <CardHeader
        title={
          <Typography>
            ACCIONES
          </Typography>
        }
        sx={{
          background: "#142a3d",
          color: "white",
          textAlign: "start",
        }}
      />
      <CardContent sx={{ display: "flex", justifyContent: "space-evenly" }}>
        {btnFinalizar()}
      </CardContent>
    </Card>
  );

  // FUNCIONES DESDE AQUI

  const gestionarSolicitud = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    const formAnulacion = { logID, solicitudEstadoID: estadoID };

    try {
      // Crear solicitud de gestión
      const response = await createSG(formAnulacion, token);

      setAlertInfo("success");

      // Actualizar mensaje y abrir diálogo de éxito
      setMessage(response.message || "Gestión creada exitosamente.");
      setOpen(true);

      // Refrescar datos y cerrar modales al terminar
      await fetchData();
      handleCloseModal();
      setIsSubmitting(false);
    } catch (error) {
      // Manejo de errores más específico para depuración y UX
      setMessage("Error al crear la gestión. Inténtalo nuevamente.");
      setAlertInfo("error");
      setOpen(true);
      handleCloseModal();
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseModal = () => {
    setOpenModalFinalizar(false);
    setOpenModalRechazar(false);
    setOpenModalLegal(false);
    setOpenModalEmpleador(false);
    setOpenModalTrabajador(false);
    setOpenModalLicencia(false);
    setOpenModalVacaciones(false);
    setOpenModalFirmada(false);
    setOpenModalNoFirmada(false);
    setOpenModalCorreo(false);
    setOpenModalDesvinculado(false);
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

  const downloadInforme = async () => {
    try {
      const payload = { file_path: filePath };
      await downloadFile(payload, token);
      console.log("Archivo descargado exitosamente");
    } catch (error) {
      console.log(error);
    }
  };

  // COMPONENTES GENERALES DESDE AQUI

  const setTableEstado = () => (
    <Box
      sx={{
        width: "80%",
        marginTop: 2,
        backgroundColor: "white",
        border: "2px solid #dfdeda",
        borderRadius: 2,
      }}
    >
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{ background: "#142a3d", fontWeight: "bold", borderTopLeftRadius: 5 }}
                align="center"
              >
                <Typography color={"white"}>FECHA</Typography>
              </TableCell>
              <TableCell
                sx={{ background: "#142a3d", fontWeight: "bold" }}
                align="center"
              >
                <Typography color={"white"}>ESTADO</Typography>
              </TableCell>
              <TableCell
                sx={{ background: "#142a3d", fontWeight: "bold", borderTopRightRadius: 5 }}
                align="center"
              >
                <Typography color={"white"}>GESTIONADO POR</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataGestiones && dataGestiones.length > 0 ? (
              dataGestiones.map((row, index) => (
                <TableRow key={index}>
                  <TableCell align="center">
                    <Typography>{extractDate(row.fecha)}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography>
                      {row.estado ? row.estado : "Sin gestiones"}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography>{row.responsable}</Typography>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <Typography fontFamily="initial">
                    Sin gestiones registradas
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
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
    <Box
      sx={{
        width: "80%",
        marginTop: 2,
        backgroundColor: "white",
        border: "2px solid #dfdeda",
        borderRadius: 2,
      }}
    >
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
            sx={{ color: "text.secondary", py: 3 }}
          >
            Sin información
          </Typography>
          <Button
            variant="contained"
            sx={{
              background: "#142a3d",
              width: "300px",
              borderRadius: 2,
            }}
            onClick={() => {
              downloadInforme();
            }}
          >
            Descarga Plantilla Informe
          </Button>
          <Link to={`/${data.area}/${data.logID}`}>
            <Button
              variant="contained"
              sx={{
                background: "#142a3d",
                width: "300px",
                borderRadius: 2,
                my: 1,
              }}
            >
              Crear Formulario
            </Button>
          </Link>
        </Box>
      )}
    </Box>
  );

  const setSolicitudView = () => (
    <Box
      sx={{
        width: "80%",
        marginTop: 2,
        backgroundColor: "white",
        borderRadius: 2,
        border: "2px solid #dfdeda",
      }}
    >
      {[
        { label: "Fecha Solicitud :", value: extractDate(data.fechaSolicitud) },
        { label: "Folio :", value: data.folio },
        { label: "Solicitante :", value: data.solicitante },
        { label: "Rut Solicitante :", value: data.rutSolicitante },
        { label: "Tipo Formulario :", value: data.area },
        { label: "Motivo :", value: data.motivo },
        { label: "Submotivo :", value: data.submotivo },
        { label: "Amonestado :", value: data.amonestado },
        { label: "Rut Amonestado :", value: data.rutAmonestado },
      ].map((item, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            border: "1px solid #e0e0e0",
            padding: 1,
          }}
        >
          <Typography
            sx={{
              width: { lg: "25%", md: "40%", sm: "50%", xs: "60%" },
              color: "text.primary",
              paddingLeft: 1,
            }}
          >
            {item.label}
          </Typography>
          <Typography
            sx={{
              color: "text.secondary",
              width: "75%",
            }}
          >
            {item.value || "Sin Información"}
          </Typography>
        </Box>
      ))}
    </Box>
  );

  // USEEFFECTS DESDE AQUI

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "auto",
        backgroundColor: "#f5f5f5",
        py: 2
      }}
    >
      {/* COMPONENTE MODAL PARA APROBAR AMONESTACION */}
      {openModalFinalizar && setModalFinalizar()}

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

      {/* COMPONENTE MODAL PARA DEFINIR COMO ENVIADA POR CORREO */}
      {openModalDesvinculado && setModalDesvinculado()}

      {/* COMPONENTE DE ALERTA */}
      {open && (
        <Alert
          onClose={handleClose}
          severity={alertInfo}
          sx={{ mb: 3, width: "90%" }}
        >
          {message}
        </Alert>
      )}

      {isLoading ? (
        <Box
          sx={{
            width: "100%",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
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
          {/* BOTON "IR A SOLICITUDES" */}
          <Box
            sx={{
              width: "80%",
              overflow: "hidden",
              mx: "auto",
            }}
          >
            <Link to="/modulo:solicitudes">
              <Button
                variant="contained"
                sx={{ background: "#142a3d", borderRadius: 2, width: "200px" }}
              >
                <Typography sx={{ color: "white" }}>
                  Volver
                </Typography>
              </Button>
            </Link>
          </Box>

          {/* COMPONENTE SOLICITUD */}
          {setSolicitudView()}

          {/* COMPONENTE DETALLES */}
          {setDetallesView()}

          {/* COMPONENTE GESTIONES */}

          {setTableEstado()}

          {/* BOX PARA ANULAR AMONESTACIONES */}
          <Box sx={{ width: "100%", mx: "auto" }}>
            {(user_id == 4) &
              (dataGestiones[0].estado != "ANULADA" &&
                dataGestiones[0].estado != "FINALIZADA")
              ? componenteAnulacion()
              : null}
          </Box>

          {/* BOX PARA EVALUACION LEGAL */}
          <Box sx={{ width: "100%", mx: "auto" }}>
            {(area && area.areaID === 5) &
              (dataGestiones[0].estado == "ENVIADA A RRHH")
              ? componenteRequiereLegal()
              : null}
          </Box>

          {/* BOX PARA EVALUACION LEGAL */}
          <Box sx={{ width: "100%", mx: "auto" }}>
            {(area && area.areaID === 5) &
              (dataGestiones[0].estado == "EVALUACION LEGAL")
              ? componenteRequiereEmpleador()
              : null}
          </Box>

          {/* BOX PARA DEFINIR ESTADO DE TRABAJADOR */}
          <Box sx={{ width: "100%", mx: "auto" }}>
            {(area && area.areaID === 5) &
              (dataGestiones[0].estado == "PENDIENTE FIRMA EMPLEADOR")
              ? componenteOperativo()
              : null}
          </Box>

          {/* BOX PARA DEFINIR ESTADO DE TRABAJADOR */}
          <Box sx={{ width: "100%", mx: "auto" }}>
            {(area && area.areaID === 5) &
              (dataGestiones[0].estado == "LICENCIA MEDICA")
              ? componenteLicencia()
              : null}
          </Box>

          {/* BOX PARA DEFINIR ESTADO DE TRABAJADOR */}
          <Box sx={{ width: "100%", mx: "auto" }}>
            {(area && area.areaID === 5) &
              (dataGestiones[0].estado == "VACACIONES")
              ? componenteVacaciones()
              : null}
          </Box>

          {/* BOX PARA DEFINIR ESTADO DE FIRMA */}
          <Box sx={{ width: "100%", mx: "auto" }}>
            {(user_id == validate) &
              (dataGestiones[0].estado == "PENDIENTE FIRMA TRABAJADOR")
              ? componenteFirmada()
              : null}
          </Box>

          {/* BOX PARA DEFINIR ESTADO DE NO FIRMADA */}
          <Box sx={{ width: "100%", mx: "auto" }}>
            {(area && area.areaID === 5) &
              (dataGestiones[0].estado == "NO FIRMADA")
              ? componenteNoFirmada()
              : null}
          </Box>

          {/* BOX PARA TRABAJADOR DESVINCULADO */}
          <Box sx={{ width: "100%", mx: "auto" }}>
            {area &&
              (area.areaID === 5) &
              (dataGestiones[0].estado != "TRABAJADOR DESVINCULADO")
              ? componenteDesvinculado()
              : null}
          </Box>

          {/* BOX PARA DEFINIR ESTADO FINALIZADA */}
          <Box sx={{ width: "100%", mx: "auto" }}>
            {(area && area.areaID === 5) &
              (dataGestiones[0].estado == "FIRMADA" || dataGestiones[0].estado == "ENVIADA POR CORREO")
              ? componenteFinalizada()
              : null}
          </Box>
        </>
      )}
    </Box>
  );
}

export default Solicitud;
