import {
  Box,
  Card,
  CircularProgress,
  CardContent,
  CardHeader,
  Checkbox,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUsers } from "../api/authAPI";
import { getModulos } from "../api/moduloAPI";
import { createPermiso } from "../api/permisosAPI";

function PermisosList() {
  const authState = useSelector((state) => state.auth);
  const { token } = authState;
  const [dataUsers, setDataUsers] = useState([]);
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [users, modulos] = await Promise.all([fetchUsers(), fetchModulos()]);
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
      console.log(res);
      resetForm();
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
  };

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
        <CardContent sx={{ width: "100%", height: "100%", overflow: "auto", display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </CardContent>
      </Box>
    );
  }

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
          title="GESTIONAR PERMISOS"
          sx={{
            backgroundColor: "#0b2f6d",
            color: "white",
            padding: "10px",
            borderBottom: "1px solid #ddd",
            fontWeight: "bold",
          }}
        />
        <CardContent sx={{ display: "flex", alignContent: "center" }}>
          <form onSubmit={handleSubmit} style={{ width: "100%", height: "100%" }}>
            <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
              <FormControl variant="filled">
                <InputLabel id="user-label">Usuario</InputLabel>
                <Select
                  required
                  labelId="user-label"
                  id="user-select"
                  sx={{ width: "350px" }}
                  value={form.userID || ""}
                  onChange={(event) => setForm((prevForm) => ({ ...prevForm, userID: event.target.value }))}
                >
                  {dataUsers.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
              <FormControl variant="filled">
                <InputLabel id="modulo-label">Modulo</InputLabel>
                <Select
                  required
                  labelId="modulo-label"
                  id="modulo-select"
                  sx={{ width: "350px" }}
                  value={form.moduloID || ""}
                  onChange={(event) => setForm((prevForm) => ({ ...prevForm, moduloID: event.target.value }))}
                >
                  {dataModulos.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
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
              label="Acceso"
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
              label="Leer"
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
              label="Editar"
              sx={{ mb: 2 }}
            />

            <Box sx={{ textAlign: "center" }}>
              <Button
                type="submit"
                variant="contained"
                sx={{ background: "#0b2f6d", fontWeight: "bold" }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Procesando..." : "Crear"}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default PermisosList;
