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
import extractDate from "../helpers/main";
import { createSG } from "../api/sgAPI";
import RrhhViewer from "../components/rrhhFormViewer";
import PrevencionViewer from "../components/prevencionFormViewer";
import CalidadViewer from "../components/calidadFormViewer";
import OperacionesViewer from "../components/operacionesFormViewer";
import LogisticaViewer from "../components/logisticaFormViewer";
import FlotaViewer from "../components/flotaFormViewer";
import { downloadFile } from "../api/downloadApi";
import { palette } from "../theme/palette";

function Solicitud() {
  const { solicitud_id } = useParams();
  const authState = useSelector((state) => state.auth);
  const { user_id, area } = authState;
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
            width: 600,
            background: palette.cardBg,
            border: `1px solid ${palette.borderSubtle}`,
            boxShadow: '0 18px 42px -16px rgba(0,0,0,0.55), 0 8px 16px -6px rgba(0,0,0,0.35)',
            p: 4,
            borderRadius: 3,
            backdropFilter: 'blur(6px)'
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
              sx={{ borderRadius: 2, background: `linear-gradient(135deg, ${palette.danger} 0%, ${palette.primaryDark} 100%)`, '&:hover': { background: palette.primaryDark } }}
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
    <Button
      variant="contained"
      onClick={() => { setEstadoID(9); setOpenModalRechazar(true); }}
      sx={{ borderRadius: 2, background: `linear-gradient(135deg, ${palette.danger} 0%, ${palette.primary} 100%)`, fontWeight: 600, letterSpacing: .3, boxShadow: '0 4px 12px -4px rgba(0,0,0,0.45)', '&:hover': { background: palette.primaryDark } }}
    >
      {isSubmitting ? "Procesando..." : "Anular Amonestación"}
    </Button>
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

  const cardBaseSx = {
    width: '80%',
    overflow: 'hidden',
    background: palette.cardBg,
    border: `1px solid ${palette.borderSubtle}`,
    boxShadow: '0 10px 28px -10px rgba(0,0,0,0.38), 0 6px 12px -4px rgba(0,0,0,0.22)',
    borderRadius: 3,
    mt: 3,
    mx: 'auto',
    backdropFilter: 'blur(4px)'
  };
  const headerSx = {
    background: `linear-gradient(140deg, ${palette.primary} 0%, ${palette.primaryDark} 100%)`,
    color: 'white',
    textAlign: 'start'
  };
  const actionsContentSx = { display: 'flex', justifyContent: 'space-evenly', flexWrap: 'wrap', gap: 2 };

  const componenteAnulacion = () => (
    <Card sx={cardBaseSx}>
      <CardHeader title={<Typography fontWeight={600}>ACCIONES</Typography>} sx={headerSx} />
      <CardContent sx={actionsContentSx}>{btnRechazar()}</CardContent>
    </Card>
  );

  const componenteRequiereLegal = () => (
    <Card sx={cardBaseSx}>
      <CardHeader title={<Typography fontWeight={600}>ACCIONES</Typography>} sx={headerSx} />
      <CardContent sx={actionsContentSx}>
        {btnRequiereLegal()}
        {btnFirmaEmpleador()}
      </CardContent>
    </Card>
  );

  const componenteDesvinculado = () => (
    <Card sx={cardBaseSx}>
      <CardHeader title={<Typography fontWeight={600}>ACCIONES</Typography>} sx={headerSx} />
      <CardContent sx={actionsContentSx}>{btnDesvinculado()}</CardContent>
    </Card>
  );

  const componenteRequiereEmpleador = () => (
    <Card sx={cardBaseSx}>
      <CardHeader title={<Typography fontWeight={600}>ACCIONES</Typography>} sx={headerSx} />
      <CardContent sx={actionsContentSx}>{btnFirmaEmpleador()}</CardContent>
    </Card>
  );

  const componenteOperativo = () => (
    <Card sx={cardBaseSx}>
      <CardHeader title={<Typography fontWeight={600}>ACCIONES</Typography>} sx={headerSx} />
      <CardContent sx={actionsContentSx}>
        {btnFirmaTrabajador()}
        {btnLicenciaMedica()}
        {btnVacaciones()}
      </CardContent>
    </Card>
  );

  const componenteLicencia = () => (
    <Card sx={cardBaseSx}>
      <CardHeader title={<Typography fontWeight={600}>ACCIONES</Typography>} sx={headerSx} />
      <CardContent sx={actionsContentSx}>
        {btnFirmaTrabajador()}
        {btnVacaciones()}
      </CardContent>
    </Card>
  );

  const componenteVacaciones = () => (
    <Card sx={cardBaseSx}>
      <CardHeader title={<Typography fontWeight={600}>ACCIONES</Typography>} sx={headerSx} />
      <CardContent sx={actionsContentSx}>
        {btnFirmaTrabajador()}
        {btnLicenciaMedica()}
      </CardContent>
    </Card>
  );

  const componenteNoFirmada = () => (
    <Card sx={cardBaseSx}>
      <CardHeader title={<Typography fontWeight={600}>ACCIONES</Typography>} sx={headerSx} />
      <CardContent sx={actionsContentSx}>{btnEnviadaCorreo()}</CardContent>
    </Card>
  );

  const componenteFirmada = () => (
    <Card sx={cardBaseSx}>
      <CardHeader title={<Typography fontWeight={600}>ACCIONES</Typography>} sx={headerSx} />
      <CardContent sx={actionsContentSx}>
        {btnFirmada()}
        {btnNoFirmada()}
      </CardContent>
    </Card>
  );

  const componenteFinalizada = () => (
    <Card sx={cardBaseSx}>
      <CardHeader title={<Typography fontWeight={600}>ACCIONES</Typography>} sx={headerSx} />
      <CardContent sx={actionsContentSx}>{btnFinalizar()}</CardContent>
    </Card>
  );

  // FUNCIONES DESDE AQUI

  const gestionarSolicitud = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    const formAnulacion = { logID, solicitudEstadoID: estadoID };

    try {
      // Crear solicitud de gestión
  const response = await createSG(formAnulacion);

      setAlertInfo("success");

      // Actualizar mensaje y abrir diálogo de éxito
      setMessage(response.message || "Gestión creada exitosamente.");
      setOpen(true);

      // Refrescar datos y cerrar modales al terminar
      await fetchData();
      handleCloseModal();
      setIsSubmitting(false);
    } catch (error) {
      console.error(error);
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
  const res = await getUniqueSolicitud(solicitud_id);
      setData(res);
      setValidate(res.userID);
      setDataGestiones(res.gestiones);
      setDataForm(res.form);
      setLogID(res.logID);
      setIsLoading(false);
      setIsSubmitting(false);
    } catch (error) {
      console.error(error);
      setMessage("Error al cargar la información");
      setOpen(true);
    }
  };

  const downloadInforme = async () => {
    try {
      const payload = { file_path: filePath };
  await downloadFile(payload);
      console.log("Archivo descargado exitosamente");
    } catch (error) {
      console.error(error);
    }
  };

  // COMPONENTES GENERALES DESDE AQUI

  const setTableEstado = () => (
  <Box sx={{ width: '80%', mt: 2, background: palette.cardBg, border: `1px solid ${palette.borderSubtle}`, borderRadius: 3, overflow: 'hidden', backdropFilter: 'blur(4px)', boxShadow: '0 6px 20px -8px rgba(0,0,0,0.3)' }}>
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
                <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? 'rgba(255,255,255,0.04)' : 'transparent', '&:hover': { backgroundColor: palette.accentSoft } }}>
                  <TableCell align="center" sx={{ fontSize: 12 }}>
                    <Typography>{extractDate(row.fecha)}</Typography>
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: 12 }}>
                    <Typography>
                      {row.estado ? row.estado : "Sin gestiones"}
                    </Typography>
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: 12 }}>
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
  <Box sx={{ width: '80%', mt: 2, background: palette.cardBg, border: `1px solid ${palette.borderSubtle}`, borderRadius: 3, backdropFilter: 'blur(4px)', boxShadow: '0 6px 20px -8px rgba(0,0,0,0.3)' }}>
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
          <Button variant="contained" sx={{ background: `linear-gradient(135deg, ${palette.primary} 0%, ${palette.primaryDark} 100%)`, width: 300, borderRadius: 2, fontWeight: 600, letterSpacing: .3, '&:hover': { background: palette.primaryDark } }} onClick={() => { downloadInforme(); }}>
            Descarga Plantilla Informe
          </Button>
          <Link to={`/${data.area}/${data.logID}`}>
            <Button variant="contained" sx={{ background: `linear-gradient(135deg, ${palette.accent} 0%, ${palette.primaryDark} 100%)`, width: 300, borderRadius: 2, my: 1, fontWeight: 600, letterSpacing: .3, '&:hover': { background: palette.primaryDark } }}>
              Crear Formulario
            </Button>
          </Link>
        </Box>
      )}
    </Box>
  );

  const setSolicitudView = () => (
  <Box sx={{ width: '80%', mt: 2, background: palette.cardBg, borderRadius: 3, border: `1px solid ${palette.borderSubtle}`, backdropFilter: 'blur(4px)', boxShadow: '0 6px 20px -8px rgba(0,0,0,0.3)' }}>
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
    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: index !== 8 ? `1px solid ${palette.borderSubtle}` : 'none', px: 1, py: .8, backgroundColor: index % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent' }}>
          <Typography
            sx={{
              width: { lg: "25%", md: "40%", sm: "50%", xs: "60%" },
      color: palette.primary,
              paddingLeft: 1,
            }}
          >
            {item.label}
          </Typography>
          <Typography
            sx={{
      color: palette.textMuted,
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
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        overflow: 'auto',
        minHeight: '100vh',
        background: palette.bgGradient,
        position: 'relative',
        py: 6,
        '::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 20% 25%, rgba(255,255,255,0.08), transparent 60%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.06), transparent 65%)',
          pointerEvents: 'none'
        }
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
          <Box sx={{ width: '80%', overflow: 'hidden', mx: 'auto' }}>
            <Link to="/modulo:solicitudes">
              <Button
                variant="contained"
                sx={{
                  background: `linear-gradient(130deg, ${palette.accent} 0%, ${palette.primary} 85%)`,
                  borderRadius: 2.5,
                  width: 200,
                  fontWeight: 600,
                  letterSpacing: .5,
                  color: 'white',
                  border: `1px solid ${palette.accentSoft}`,
                  boxShadow: '0 4px 14px -6px rgba(0,0,0,0.55)',
                  textTransform: 'uppercase',
                  transition: 'background .25s ease, box-shadow .25s ease, transform .25s ease',
                  '&:hover': {
                    background: `linear-gradient(130deg, ${palette.accent} 0%, ${palette.primaryDark} 90%)`,
                    boxShadow: '0 6px 18px -8px rgba(0,0,0,0.65)'
                  },
                  '&:active': { transform: 'translateY(1px)', boxShadow: '0 3px 10px -5px rgba(0,0,0,0.55)' },
                  '&:focus-visible': { outline: `2px solid ${palette.accent}`, outlineOffset: 3 }
                }}
              >
                Volver
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
          <Box sx={{ width: '100%', mx: 'auto' }}>
            {(user_id == 4) && (dataGestiones[0].estado != 'ANULADA' && dataGestiones[0].estado != 'FINALIZADA') ? componenteAnulacion() : null}
          </Box>

          {/* BOX PARA EVALUACION LEGAL */}
          <Box sx={{ width: '100%', mx: 'auto' }}>
            {(area && area.areaID === 5) && (dataGestiones[0].estado == 'ENVIADA A RRHH') ? componenteRequiereLegal() : null}
          </Box>

          {/* BOX PARA EVALUACION LEGAL */}
          <Box sx={{ width: '100%', mx: 'auto' }}>
            {(area && area.areaID === 5) && (dataGestiones[0].estado == 'EVALUACION LEGAL') ? componenteRequiereEmpleador() : null}
          </Box>

          {/* BOX PARA DEFINIR ESTADO DE TRABAJADOR */}
          <Box sx={{ width: '100%', mx: 'auto' }}>
            {(area && area.areaID === 5) && (dataGestiones[0].estado == 'PENDIENTE FIRMA EMPLEADOR') ? componenteOperativo() : null}
          </Box>

          {/* BOX PARA DEFINIR ESTADO DE TRABAJADOR */}
          <Box sx={{ width: '100%', mx: 'auto' }}>
            {(area && area.areaID === 5) && (dataGestiones[0].estado == 'LICENCIA MEDICA') ? componenteLicencia() : null}
          </Box>

          {/* BOX PARA DEFINIR ESTADO DE TRABAJADOR */}
          <Box sx={{ width: '100%', mx: 'auto' }}>
            {(area && area.areaID === 5) && (dataGestiones[0].estado == 'VACACIONES') ? componenteVacaciones() : null}
          </Box>

          {/* BOX PARA DEFINIR ESTADO DE FIRMA */}
          <Box sx={{ width: '100%', mx: 'auto' }}>
            {(user_id == validate) && (dataGestiones[0].estado == 'PENDIENTE FIRMA TRABAJADOR') ? componenteFirmada() : null}
          </Box>

          {/* BOX PARA DEFINIR ESTADO DE NO FIRMADA */}
          <Box sx={{ width: '100%', mx: 'auto' }}>
            {(area && area.areaID === 5) && (dataGestiones[0].estado == 'NO FIRMADA') ? componenteNoFirmada() : null}
          </Box>

          {/* BOX PARA TRABAJADOR DESVINCULADO */}
          <Box sx={{ width: '100%', mx: 'auto' }}>
            {area && (area.areaID === 5) && (dataGestiones[0].estado != 'TRABAJADOR DESVINCULADO') ? componenteDesvinculado() : null}
          </Box>

          {/* BOX PARA DEFINIR ESTADO FINALIZADA */}
          <Box sx={{ width: '100%', mx: 'auto' }}>
            {(area && area.areaID === 5) && (dataGestiones[0].estado == 'FIRMADA' || dataGestiones[0].estado == 'ENVIADA POR CORREO') ? componenteFinalizada() : null}
          </Box>
        </>
      )}
    </Box>
  );
}

export default Solicitud;
