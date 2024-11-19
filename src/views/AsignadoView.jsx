import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  InputLabel,
  Skeleton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import AddIcon from "@mui/icons-material/Add";
import { getProyectoUnico } from "../api/proyectoAPI";

function Asignado() {
  const { proyectoID } = useParams();
  const proyectoState = useSelector((state) => state.proyectos);
  const authState = useSelector((state) => state.auth);
  const { token } = authState;
  const { data } = proyectoState;
  const [dataEmpresa, setDataEmpresa] = useState(undefined);
  const [dataProyecto, setDataProyecto] = useState(undefined);
  const [proyecto, setProyecto] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    mufa: 0,
    cdpi: 0,
    cto: 0,
    cdpe: 0,
  });

  const fetchData = async () => {
    try {
      const res = await getProyectoUnico(token, proyectoID);
      console.log(res);
      setDataProyecto(res);
      setDataEmpresa(res.empresa);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const proyectoCard = () => (
    <Box sx={{ pt: 2, display: "flex", justifyContent: "center" }}>
      {proyecto ? (
        <Paper sx={{ width: "100%", textAlign: "start" }}>
          <Grid container spacing={2}>
            {/* REGION */}
            <Grid item xs={12} sm={3}>
              <Typography
                fontWeight="bold"
                sx={{
                  fontFamily: "initial",
                  background: "#e8e8e8",
                  p: 1
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
                {proyecto.direccion ? proyecto.direccion : "Sin Información"}
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
                {proyecto["Fuente"] ? proyecto["Fuente"] : "Sin Información"}
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
                {proyecto["Origen"] ? proyecto["Origen"] : "Sin Información"}
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
    </Box>
  );

  const contenedorCard = () => (
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
        avatar={<FormatAlignJustifyIcon />}
        title={
          <Typography fontWeight="bold" sx={{ fontFamily: "initial" }}>
            PROYECTO ASIGNADO CON ID #{proyectoID}
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
          {[
            { label: "NOMBRE EMPRESA :", value: dataEmpresa.nombre },
            { label: "RUT EMPRESA :", value: dataEmpresa.rut },
          ].map((item, index) => (
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
                  textAlign: "start",
                }}
              >
                {item.label}
              </Typography>
              <Typography
                sx={{
                  fontFamily: "initial",
                  color: "text.secondary",
                  width: "70%",
                  p: 1,
                }}
              >
                {item.value || "Sin Información"}
              </Typography>
            </Box>
          ))}
        </Paper>
        {proyectoCard()}
      </CardContent>
    </Card>
  );

  const setValuesCard = () => (
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
        avatar={<AddIcon />}
        title={
          <Typography fontWeight="bold" sx={{ fontFamily: "initial" }}>
            ASIGNANDO VALORES PARA PROYECTO #{proyectoID}
          </Typography>
        }
        sx={{
          background: "#0b2f6d",
          color: "white",
          textAlign: "end",
        }}
      />
      <Paper>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ mb: 2 }}>
                <InputLabel id="mufa-label" sx={{ fontFamily: "initial" }}>
                  MUFA
                </InputLabel>
                <TextField
                  fullWidth
                  required
                  id="mufa"
                  type="number"
                  name="mufa"
                  variant="outlined"
                  value={form.mufa}
                  onChange={handleChange}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ mb: 2 }}>
                <InputLabel id="cdpi-label" sx={{ fontFamily: "initial" }}>
                  CDPI
                </InputLabel>
                <TextField
                  fullWidth
                  required
                  id="cdpi"
                  type="number"
                  name="cdpi"
                  variant="outlined"
                  value={form.cdpi}
                  onChange={handleChange}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ mb: 2 }}>
                <InputLabel id="cto-label" sx={{ fontFamily: "initial" }}>
                  CTO
                </InputLabel>
                <TextField
                  fullWidth
                  required
                  id="cto"
                  type="number"
                  name="cto"
                  variant="outlined"
                  value={form.cto}
                  onChange={handleChange}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ mb: 2 }}>
                <InputLabel id="cdpe-label" sx={{ fontFamily: "initial" }}>
                  CDPE
                </InputLabel>
                <TextField
                  fullWidth
                  required
                  id="cdpe"
                  type="number"
                  name="cdpe"
                  variant="outlined"
                  value={form.cdpe}
                  onChange={handleChange}
                />
              </Box>
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{
              background: "#0b2f6d",
              borderRadius: "0px",
              width: "200px",
              fontWeight: "bold",
            }}
          >
            {isSubmitting ? "Cargando..." : "Asignar"}
          </Button>
        </form>
      </CardContent>
      </Paper>
    </Card>
  );

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (proyectoID) {
      const foundInfo = data.find((item) => item.proyecto === proyectoID);
      setProyecto(foundInfo);
    }
  }, [proyectoID]);

  useEffect(() => {
    console.log(proyecto);
  }, [proyecto]);

  return (
    <>
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
            <Box sx={{ width: "90%" }}>
              <Link to="/asignados">
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
                  Volver a Asignados
                </Button>
              </Link>
            </Box>

            {contenedorCard()}
            {setValuesCard()}
          </>
        )}
      </Box>
    </>
  );
}
export default Asignado;
