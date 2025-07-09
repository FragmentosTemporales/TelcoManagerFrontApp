import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Skeleton,
  Paper,
  Typography,
} from "@mui/material";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAst } from "../api/prevencionAPI";
import { useSelector } from "react-redux";
import extractDate from "../helpers/main";

function AstViewer() {
  const { formID } = useParams();
  const authState = useSelector((state) => state.auth);
  const { token } = authState;
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [worker, setWorker] = useState(null);

  const fetchData = async () => {
    try {
      const res = await getAst(token, formID);
      setData(res);
      setWorker(res.usuario);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

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
        height: "100%",
        width: "100%",
        overflow: "auto",
        paddingTop: 8,
        paddingBottom: "50px",
        backgroundColor: "#f0f0f0",
      }}
    >
      <Box
        sx={{
          width: "80%",
          overflow: "hidden",
          mt: 3,
        }}
      >
        <Link to="/form-ast-list">
          <Button
            variant="contained"
            sx={{ background: "#0b2f6d", borderRadius: "0px", width: "200px" }}
          >
            <Typography fontWeight="bold" sx={{ color: "#fff" }}>
              VOLVER
            </Typography>
          </Button>
        </Link>
      </Box>
      {isLoading ? (
        <Box
          sx={{ width: "80%", mb: 3, background: "#fff", boxShadow: 2, mt: 2 }}
        >
          <Skeleton
            variant="rounded"
            width={"100%"}
            height={"70%"}
            sx={{ m: 3 }}
          />
        </Box>
      ) : (
        <Box
          sx={{ width: "80%", mb: 3, background: "#fff", boxShadow: 2, mt: 2 }}
        >
          <Box sx={{ display: "flex", alignItems: "center", p: 2, background: "#0b2f6d" }}>
            <Typography variant="h5" sx={{ color: "#fff", flexGrow: 1, textAlign: "center", fontWeight: "bold" }}>
              ANALISIS SEGURO DEL TRABAJO
            </Typography>
          </Box>
          <Box sx={{ display: "column", justifyContent: "center" }}>
            {[
              { label: "Nombre :", value: worker.nombre },
              { label: "Rut :", value: worker.numDoc },
              { label: "Empresa :", value: worker.empresa.nombre },
              { label: "Fecha :", value: extractDate(data.fechaForm) },
            ].map((item, index) => (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: 1,
                  borderBottom: "1px solid #e0e0e0",
                }}
              >
                <Typography
                  sx={{
                    width: { lg: "25%", md: "40%", sm: "50%", xs: "60%" },
                    color: "text.primary",
                    paddingLeft: 1,
                    fontWeight: "bold",
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
          <Box sx={{ display: "column", justifyContent: "center", mt: 2 }}>
            {[
              {
                label: "¿Existe riesgo de ser golpeado por un objeto?",
                value: data.golpeadoPor,
              },
              {
                label: "¿Existe riesgo de una descarga eléctrica?",
                value: data.descargaElectrica,
              },
              {
                label: "¿Existe riesgo de una caída en altura?",
                value: data.caidaAltura,
              },
              {
                label: "¿Existe riesgo de tropiezo?",
                value: data.tropiezo,
              },
              {
                label:
                  "¿Existe la posibilidad de una distensión muscular, producto de un levantamiento, flexión o dislocación?",
                value: data.distensionMuscular,
              },
              {
                label:
                  "¿Existe la posibilidad de ser colisionado por otro vehículo?",
                value: data.colicionadoPor,
              },
              {
                label:
                  "¿Las condiciones del vehículo son adecuadas para desempeñar las labores diarias?",
                value: data.condicionVehicular,
              },
              {
                label:
                  "¿Se han identificado en el área de trabajo los posibles riesgos como piso resbaladizos, obstáculos, etc?",
                value: data.areaTrabajo,
              },
              {
                label:
                  "¿Se ha realizado la ventilación adecuada del espacio de trabajo en caso de realizar actividades en cámaras subterráneas?",
                value: data.ventilacionAdecuada,
              },
              {
                label:
                  "¿Se ha delimitado correctamente el área con barreras físicas, cintas de seguridad, conos, vallas u otros elementos?",
                value: data.areaDelimitada,
              },
              {
                label: "Medidas de control definidas",
                value: data.observacion,
              },
            ].map((item, index) => (
              <Box key={index} sx={{ padding: 1, borderBottom: "1px solid #e0e0e0" }}>
                <Typography
                  sx={{
                    width: "100%",
                    color: "text.primary",
                    paddingLeft: 1,
                    fontWeight : "bold",
                  }}
                >
                  {item.label}
                </Typography>
                <Typography
                  sx={{
                    color: "text.secondary",
                    width: "100%",
                    p: 1,
                  }}
                >
                  {item.value || "Sin Información"}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}
export default AstViewer;
