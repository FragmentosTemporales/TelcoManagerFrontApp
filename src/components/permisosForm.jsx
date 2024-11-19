import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import AddModeratorIcon from "@mui/icons-material/AddModerator";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUsers } from "../api/authAPI";
import { getModulos } from "../api/moduloAPI";
import { createPermiso, getPermisos, updatePermiso } from "../api/permisosAPI";

function PermisosList() {
  const authState = useSelector((state) => state.auth);
  const { token } = authState;
  const [dataUsers, setDataUsers] = useState([]);
  const [dataPermisos, setDataPermisos] = useState(undefined);
  const [updateForm, setUpdateForm] = useState({
    userID: "",
    moduloID: "",
    access: false,
    read: false,
    edit: false,
  });
  const [dataModulos, setDataModulos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    userID: "",
    moduloID: "",
    access: false,
    read: false,
    edit: false,
  });
  const [openModal, setOpenModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [user_id, setUser_id] = useState(undefined);
  const [id, setID] = useState(undefined);
  const [message, setMessage] = useState(undefined);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [users, modulos] = await Promise.all([
          fetchUsers(),
          fetchModulos(),
        ]);
        setDataUsers(users);
        setDataModulos(modulos);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await createPermiso(form, token);
      resetForm();
    } catch (error) {
      console.error("Error creating permission:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const ActualizarPermiso = async () => {
    try {
      setIsSubmitting(true);
      const res = await updatePermiso(token, updateForm, id);
      setMessage(res.message);
      setOpenModal(false)
      setOpen(true);
      setIsSubmitting(false);
      resetForm()
    } catch (error) {
      console.log("Error al actualizar el permiso:", error);
      setMessage(error);
      setOpenModal(false)
      setOpen(true);
      setIsSubmitting(false);
      resetForm()
    }
  };

  const handleSubmitPermisos = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await getPermisos(token, user_id);
      setDataPermisos(res);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error creating permission:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckBox = (e) => {
    setForm((prevForm) => ({
      ...prevForm,
      [e.target.name]: e.target.checked,
    }));
  };

  const handleUpdateCheckBox = (e) => {
    setUpdateForm((prevForm) => ({
      ...prevForm,
      [e.target.name]: e.target.checked,
    }));
  };

  const fetchUsers = async () => {
    const res = await getUsers(token);
    return res.map((item) => ({ value: item.userID, label: item.nombre }));
  };

  const fetchModulos = async () => {
    const res = await getModulos(token);
    return res.map((item) => ({ value: item.moduloID, label: item.nombre }));
  };

  const resetForm = () => {
    setForm({
      userID: "",
      moduloID: "",
      access: false,
      read: false,
      edit: false,
    });
    setUpdateForm({
      userID: "",
      moduloID: "",
      access: false,
      read: false,
      edit: false,
    });
  };

  const setCreatePermiso = () => (
    <>
      <Card
        sx={{
          borderRadius: "0px",
          width: { lg: "50%", xs: "90%", md: "70%" },
          overflow: "auto",
          boxShadow: 5,
          textAlign: "center",
          mb: 2,
        }}
      >
        <CardHeader
          title={
            <Typography fontWeight="bold" sx={{ fontFamily: "initial" }}>
              PERMISOS
            </Typography>
          }
          avatar={<AddModeratorIcon />}
          sx={{
            background: "#0b2f6d",
            color: "white",
            textAlign: "end",
          }}
        />
        <CardContent sx={{ display: "flex", alignContent: "center" }}>
          <form
            onSubmit={handleSubmit}
            style={{ width: "100%", height: "100%" }}
          >
            <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
              <FormControl variant="filled">
                <InputLabel id="user-label" sx={{ fontFamily: "initial" }}>
                  Usuario
                </InputLabel>
                <Select
                  required
                  labelId="user-label"
                  id="user-select"
                  sx={{ width: "350px" }}
                  value={form.userID || ""}
                  onChange={(event) =>
                    setForm((prevForm) => ({
                      ...prevForm,
                      userID: event.target.value,
                    }))
                  }
                >
                  {dataUsers.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Typography
                        fontWeight="bold"
                        sx={{ fontFamily: "initial" }}
                      >
                        {option.label}
                      </Typography>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
              <FormControl variant="filled">
                <InputLabel id="modulo-label" sx={{ fontFamily: "initial" }}>
                  Modulo
                </InputLabel>
                <Select
                  required
                  labelId="modulo-label"
                  id="modulo-select"
                  sx={{ width: "350px" }}
                  value={form.moduloID || ""}
                  onChange={(event) =>
                    setForm((prevForm) => ({
                      ...prevForm,
                      moduloID: event.target.value,
                    }))
                  }
                >
                  {dataModulos.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Typography
                        fontWeight="bold"
                        sx={{ fontFamily: "initial" }}
                      >
                        {option.label}
                      </Typography>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <FormControlLabel
              control={
                <Checkbox
                  checked={form.access}
                  onChange={handleCheckBox}
                  name="access"
                  color="primary"
                />
              }
              label={
                <Typography sx={{ fontFamily: "initial" }}>Acceso</Typography>
              }
              sx={{ mb: 2 }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={form.read}
                  onChange={handleCheckBox}
                  name="read"
                  color="primary"
                />
              }
              label={
                <Typography sx={{ fontFamily: "initial" }}>Leer</Typography>
              }
              sx={{ mb: 2 }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={form.edit}
                  onChange={handleCheckBox}
                  name="edit"
                  color="primary"
                />
              }
              label={
                <Typography sx={{ fontFamily: "initial" }}>Editar</Typography>
              }
              sx={{ mb: 2 }}
            />

            <Box sx={{ textAlign: "center" }}>
              <Button
                type="submit"
                variant="contained"
                sx={{ background: "#0b2f6d", fontWeight: "bold" }}
                disabled={isSubmitting}
              >
                <Typography sx={{ fontFamily: "initial" }}>
                  {isSubmitting ? "Procesando..." : "Crear"}
                </Typography>
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </>
  );

  const setViewPermisos = () => (
    <>
      <Card
        sx={{
          borderRadius: "0px",
          width: { lg: "50%", xs: "90%", md: "70%" },
          overflow: "auto",
          boxShadow: 5,
          textAlign: "center",
        }}
      >
        <CardHeader
          title={
            <Typography fontWeight="bold" sx={{ fontFamily: "initial" }}>
              GESTIONAR PERMISOS POR USUARIO
            </Typography>
          }
          avatar={<LockOpenIcon />}
          sx={{
            background: "#0b2f6d",
            color: "white",
            textAlign: "end",
          }}
        />
        <CardContent sx={{ display: "flex", alignContent: "center" }}>
          <form
            onSubmit={handleSubmitPermisos}
            style={{ width: "100%", height: "100%" }}
          >
            <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
              <FormControl variant="filled">
                <InputLabel id="user-label" sx={{ fontFamily: "initial" }}>
                  Usuario
                </InputLabel>
                <Select
                  required
                  labelId="user-label"
                  id="user-select"
                  sx={{ width: "350px" }}
                  value={user_id || ""}
                  onChange={(event) => setUser_id(event.target.value)}
                >
                  {dataUsers.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Typography fontFamily="initial">
                        {option.label}
                      </Typography>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ textAlign: "center" }}>
              <Button
                type="submit"
                variant="contained"
                sx={{ background: "#0b2f6d", fontWeight: "bold" }}
                disabled={isSubmitting}
              >
                <Typography fontFamily="initial">
                  {isSubmitting ? "Procesando..." : "Consultar"}
                </Typography>
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </>
  );

  const setTableHead = () => (
    <>
      <TableHead>
        <TableRow>
          {["MODULO", "ACCESO", "EDICION", "LECTURA", "ACCIONES"].map(
            (header) => (
              <TableCell
                key={header}
                align="center"
                sx={{ background: "#d8d8d8", fontWeight: "bold" }}
              >
                <Typography fontFamily="initial">{header}</Typography>
              </TableCell>
            )
          )}
        </TableRow>
      </TableHead>
    </>
  );

  const setTableBody = () => (
    <>
      <TableBody
        sx={{
          display: "column",
          justifyContent: "center",
        }}
      >
        {dataPermisos && dataPermisos != undefined ? (
          dataPermisos.map((row, index) => (
            <TableRow key={index}>
              <TableCell align="center" sx={{ fontSize: "16px" }}>
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.modulo ? row.modulo.nombre : "Sin Información"}
                </Typography>
              </TableCell>
              <TableCell align="center" sx={{ fontSize: "16px" }}>
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.access ? (
                    <Chip label="SI" color="success" />
                  ) : (
                    <Chip label="NO" color="error" />
                  )}
                </Typography>
              </TableCell>
              <TableCell align="center" sx={{ fontSize: "16px" }}>
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.edit ? (
                    <Chip label="SI" color="success" />
                  ) : (
                    <Chip label="NO" color="error" />
                  )}
                </Typography>
              </TableCell>
              <TableCell align="center" sx={{ fontSize: "16px" }}>
                <Typography fontFamily={"initial"} variant="secondary">
                  {row.read ? (
                    <Chip label="SI" color="success" />
                  ) : (
                    <Chip label="NO" color="error" />
                  )}
                </Typography>
              </TableCell>
              <TableCell align="center" sx={{ fontSize: "16px" }}>
                <Tooltip title="Editar">
                  <Button
                    variant="contained"
                    color="info"
                    size="small"
                    onClick={() => {
                      setID(row.permisoID);
                      setUpdateForm((prevForm) => ({
                        ...prevForm,
                        userID: user_id,
                        moduloID: row.moduloID,
                      }));
                      setOpenModal(true);
                    }}
                    sx={{ borderRadius: "25px" }}
                  >
                    <EditIcon />
                  </Button>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} align="center">
              <Typography fontFamily="initial">
                No hay datos disponibles
              </Typography>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </>
  );

  const setTable = () => (
    <Box
      sx={{
        borderRadius: "0px",
        width: { lg: "50%", xs: "90%", md: "70%" },
        overflow: "auto",
        boxShadow: 5,
        textAlign: "center",
      }}
    >
      <TableContainer>
        <Table
          sx={{ width: "100%", display: "column", justifyContent: "center" }}
        >
          {setTableHead()}
          {setTableBody()}
        </Table>
      </TableContainer>
    </Box>
  );

  const handleClose = () => {
    setOpenModal(false);
    setOpen(false);
  };

  const setModal = () => (
    <>
      <Modal open={openModal} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            height: "200px",
            width: "600px",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            fontFamily={"initial"}
            sx={{ pt: 2 }}
          >
            {`Editar Info de Permiso con ID #${id}`}
          </Typography>
          <Divider sx={{ mt: 1 }} />
          <Box sx={{ mb: 2, pt: 2, display: "flex", justifyContent: "center" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={updateForm.access}
                  onChange={handleUpdateCheckBox}
                  name="access"
                  color="primary"
                />
              }
              label="Acceso"
              sx={{ mb: 2 }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={updateForm.read}
                  onChange={handleUpdateCheckBox}
                  name="read"
                  color="primary"
                />
              }
              label="Leer"
              sx={{ mb: 2 }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={updateForm.edit}
                  onChange={handleUpdateCheckBox}
                  name="edit"
                  color="primary"
                />
              }
              label="Editar"
              sx={{ mb: 2 }}
            />
          </Box>
          <Button
            variant="contained"
            onClick={ActualizarPermiso}
            sx={{ backgroundColor: "#0b2f6d" }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Procesando..." : "Actualizar"}
          </Button>
        </Box>
      </Modal>
    </>
  );

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: { xs: 10, md: 8 },
          mt: 2,
        }}
      >
        <CardContent
          sx={{
            width: "100%",
            height: "100%",
            overflow: "auto",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </CardContent>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        pt: 2,
        pb: 2,
      }}
    >{openModal && setModal()}
    {setCreatePermiso()}
      {open && (
        <Alert
          onClose={handleClose}
          severity="info"
          sx={{ marginBottom: 3,}}
        >
          {message}
        </Alert>
      )}
      
      
      {setViewPermisos()}
      {setTable()}
    </Box>
  );
}

export default PermisosList;
