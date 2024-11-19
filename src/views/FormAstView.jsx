import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  InputLabel,
  MenuItem,
  TextField,
  Select,
  Typography,
} from "@mui/material";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { createAST } from "../api/prevencionAPI";

function FormAstCreate() {
  const authState = useSelector((state) => state.auth);
  const { token, user_id } = authState;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("info");

  const [form, setForm] = useState({
    userID: user_id,
    actividad: "",
    lugar: "",
    ot: "",
    golpeadoPor: "",
    descargaElectrica: "",
    caidaAltura: "",
    tropiezo: "",
    distensionMuscular: "",
  });

  const handleClose = () => setOpen(false);

  const renderAlert = () => (
    <Alert onClose={handleClose} severity={alertSeverity} sx={{ marginBottom: 3 }}>
      {message}
    </Alert>
  );


  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const payload = form;

    try {
      const res = await createAST(payload, token);
      setMessage(res.message);
      setAlertSeverity("success");
      setOpen(true);
      setForm({
        actividad: "",
        lugar: "",
        ot: "",
        golpeadoPor: "",
        descargaElectrica: "",
        caidaAltura: "",
        tropiezo: "",
        distensionMuscular: "",
      });
      setIsSubmitting(false);
    } catch (error) {
      setMessage(error);
      setIsSubmitting(false);
      setAlertSeverity("error");
      setOpen(true);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background: "white",
        alignItems: "center",
        pt: 8,
        height: "100%",
      }}
    >
      {open && renderAlert()}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          width: { lg: "100%", xs: "100%", md: "100%" },
        }}
      >
        <Card
          sx={{
            borderRadius: "0px",
            width: { lg: "70%", xs: "100%", md: "100%" },
            overflow: "auto",
            boxShadow: 5,
            textAlign: "center",
            background:"#f5f5f5"
          }}
        >
          <CardHeader
            title={
              <Typography fontWeight="bold" sx={{ fontFamily: "initial" }}>
                FORMULARIO AST
              </Typography>
            }
            avatar={<FormatListNumberedIcon />}
            sx={{
              background: "#0b2f6d",
              color: "white",
              textAlign: "end",
            }}
          />
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <Box
                sx={{
                  mb: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <InputLabel
                  id="actividad-label"
                  sx={{ fontFamily: "initial" }}
                >
                  Actividad
                </InputLabel>
                <TextField
                  sx={{
                    fontFamily: "initial",
                    whiteSpace: "normal",
                    width: { lg: "70%", xs: "100%", md: "100%" },
                    textAlign: "center",
                    background: "#ffffff"
                  }}
                  fullWidth
                  required
                  id="actividad"
                  type="text"
                  name="actividad"
                  variant="outlined"
                  value={form.actividad}
                  onChange={handleChange}
                />
              </Box>

              <Box
                sx={{
                  mb: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <InputLabel
                  id="lugar-label"
                  sx={{
                    fontFamily: "initial",
                    whiteSpace: "normal",
                    maxWidth: "70%",
                    textAlign: "center",
                  }}
                >
                  Lugar
                </InputLabel>
                <TextField
                  sx={{
                    fontFamily: "initial",
                    whiteSpace: "normal",
                    width: { lg: "70%", xs: "100%", md: "100%" },
                    textAlign: "center",
                    background: "#ffffff"
                  }}
                  required
                  id="lugar"
                  type="text"
                  name="lugar"
                  variant="outlined"
                  value={form.lugar}
                  onChange={handleChange}
                />
              </Box>

              <Box
                sx={{
                  mb: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <InputLabel
                  id="ot-label"
                  sx={{
                    fontFamily: "initial",
                    whiteSpace: "normal",
                    maxWidth: "70%",
                    textAlign: "center",
                  }}
                >
                  Orden de Trabajo
                </InputLabel>
                <TextField
                  sx={{
                    fontFamily: "initial",
                    whiteSpace: "normal",
                    width: { lg: "70%", xs: "100%", md: "100%" },
                    textAlign: "center",
                    background: "#ffffff"
                  }}
                  required
                  id="ot"
                  type="text"
                  name="ot"
                  variant="outlined"
                  value={form.ot}
                  onChange={handleChange}
                />
              </Box>

              <Box
                sx={{
                  mb: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <InputLabel
                  id="empresa-label"
                  sx={{
                    fontFamily: "initial",
                    whiteSpace: "normal",
                    maxWidth: "70%",
                    textAlign: "center",
                  }}
                >
                  ¿Existe riesgo de ser golpeado por un objeto?
                </InputLabel>
                <Select
                  sx={{
                    fontFamily: "initial",
                    whiteSpace: "normal",
                    width: { lg: "70%", xs: "100%", md: "100%" },
                    textAlign: "center",
                    background: "#ffffff"
                  }}
                  labelId="golpeadoPor-label"
                  id="golpeadoPor"
                  name="golpeadoPor"
                  value={form.golpeadoPor}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  fontFamily="initial"
                >
                  <MenuItem value="SI" sx={{ fontFamily: "initial" }}>
                    SI
                  </MenuItem>
                  <MenuItem value="NO" sx={{ fontFamily: "initial" }}>
                    NO
                  </MenuItem>
                  <MenuItem value="NO APLICA" sx={{ fontFamily: "initial" }}>
                    NO APLICA
                  </MenuItem>
                </Select>
              </Box>

              <Box
                sx={{
                  mb: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <InputLabel
                  id="descargaElectrica-label"
                  sx={{
                    fontFamily: "initial",
                    whiteSpace: "normal",
                    maxWidth: "70%",
                    textAlign: "center",
                  }}
                >
                  ¿Existe riesgo de una descarga eléctrica?
                </InputLabel>
                <Select
                  sx={{
                    fontFamily: "initial",
                    whiteSpace: "normal",
                    width: { lg: "70%", xs: "100%", md: "100%" },
                    textAlign: "center",
                    background: "#ffffff"
                  }}
                  required
                  id="descargaElectrica"
                  name="descargaElectrica"
                  variant="outlined"
                  value={form.descargaElectrica}
                  onChange={handleChange}
                  fontFamily="initial"
                >
                  <MenuItem value="SI" sx={{ fontFamily: "initial" }}>
                    SI
                  </MenuItem>
                  <MenuItem value="NO" sx={{ fontFamily: "initial" }}>
                    NO
                  </MenuItem>
                  <MenuItem value="NO APLICA" sx={{ fontFamily: "initial" }}>
                    NO APLICA
                  </MenuItem>
                </Select>
              </Box>

              <Box
                sx={{
                  mb: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <InputLabel
                  id="caidaAltura-label"
                  sx={{
                    fontFamily: "initial",
                    whiteSpace: "normal",
                    maxWidth: "70%",
                    textAlign: "center",
                  }}
                >
                  ¿Existe riesgo de caída en altura?
                </InputLabel>
                <Select
                  sx={{
                    fontFamily: "initial",
                    whiteSpace: "normal",
                    width: { lg: "70%", xs: "100%", md: "100%" },
                    textAlign: "center",
                    background: "#ffffff"
                  }}
                  required
                  id="caidaAltura"
                  name="caidaAltura"
                  variant="outlined"
                  value={form.caidaAltura}
                  onChange={handleChange}
                  fontFamily="initial"
                >
                  <MenuItem value="SI" sx={{ fontFamily: "initial" }}>
                    SI
                  </MenuItem>
                  <MenuItem value="NO" sx={{ fontFamily: "initial" }}>
                    NO
                  </MenuItem>
                  <MenuItem value="NO APLICA" sx={{ fontFamily: "initial" }}>
                    NO APLICA
                  </MenuItem>
                </Select>
              </Box>

              <Box
                sx={{
                  mb: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <InputLabel
                  id="tropiezo-label"
                  sx={{
                    fontFamily: "initial",
                    whiteSpace: "normal",
                    maxWidth: "70%",
                    textAlign: "center",
                  }}
                >
                  ¿Existe riesgo de tropiezo?
                </InputLabel>
                <Select
                  sx={{
                    fontFamily: "initial",
                    whiteSpace: "normal",
                    width: { lg: "70%", xs: "100%", md: "100%" },
                    textAlign: "center",
                    background: "#ffffff"
                  }}
                  required
                  id="tropiezo"
                  name="tropiezo"
                  variant="outlined"
                  value={form.tropiezo}
                  onChange={handleChange}
                  fontFamily="initial"
                >
                  <MenuItem value="SI" sx={{ fontFamily: "initial" }}>
                    SI
                  </MenuItem>
                  <MenuItem value="NO" sx={{ fontFamily: "initial" }}>
                    NO
                  </MenuItem>
                  <MenuItem value="NO APLICA" sx={{ fontFamily: "initial" }}>
                    NO APLICA
                  </MenuItem>
                </Select>
              </Box>

              <Box
                sx={{
                  mb: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <InputLabel
                  id="distensionMuscular-label"
                  sx={{
                    fontFamily: "initial",
                    whiteSpace: "normal",
                    maxWidth: "70%",
                    textAlign: "center",
                  }}
                >
                  ¿Existe la posibilidad de una distención muscular, producto de
                  un levantamiento, flexión o dislocación?
                </InputLabel>
                <Select
                  sx={{
                    fontFamily: "initial",
                    whiteSpace: "normal",
                    width: { lg: "70%", xs: "100%", md: "100%" },
                    textAlign: "center",
                    background: "#ffffff"
                  }}
                  required
                  id="distensionMuscular"
                  name="distensionMuscular"
                  variant="outlined"
                  value={form.distensionMuscular}
                  onChange={handleChange}
                  fontFamily="initial"
                >
                  <MenuItem value="SI" sx={{ fontFamily: "initial" }}>
                    SI
                  </MenuItem>
                  <MenuItem value="NO" sx={{ fontFamily: "initial" }}>
                    NO
                  </MenuItem>
                  <MenuItem value="NO APLICA" sx={{ fontFamily: "initial" }}>
                    NO APLICA
                  </MenuItem>
                </Select>
              </Box>

              <Box sx={{ textAlign: "center" }}>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ background: "#0b2f6d", fontWeight: "bold" }}
                  disabled={isSubmitting}
                >
                  <Typography sx={{ fontFamily: "initial" }}>
                    {isSubmitting ? "Procesando..." : "Enviar"}
                  </Typography>
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default FormAstCreate;
