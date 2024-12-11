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
        minHeight: "85vh",
        overflow: "auto",
        padding: 8,
      }}
    >
      <Box
            sx={{
              width: "90%",
              overflow: "hidden",
              borderRadius: "0",
              mt: 3,
            }}
          >
            <Link to="/form-ast-list">
              <Button variant="contained" sx={{ background: "#0b2f6d", borderRadius: "0", }}>
                Volver
              </Button>
            </Link>
          </Box>
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
                  FORMULARIO AST ID #{formID}
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
                  { label: "Nombre :", value: worker.nombre },
                  { label: "Rut :", value: worker.numDoc },
                  { label: "Empresa :", value: worker.empresa.nombre },
                  { label: "Fecha :", value: extractDate(data.fechaForm) }
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
              <Paper sx={{ display:'column', justifyContent:'center', mt:2}}>
                {[
                  { label: "¿Existe riesgo de ser golpeado por un objeto?", value: data.golpeadoPor },
                  { label: "¿Existe riesgo de una descarga eléctrica?", value: data.descargaElectrica },
                  { label: "¿Existe riesgo de una caída en altura?", value: data.caidaAltura },
                  { label: "¿Existe riesgo de tropiezo?", value: data.tropiezo },
                  { label: "¿Existe la posibilidad de una distensión muscular, producto de un levantamiento, flexión o dislocación?", value: data.distensionMuscular },
                  { label: "Medidas de control definidas", value: data.observacion }
                ].map((item, index) => (
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        fontFamily: "initial",
                        background: "#e8e8e8",
                        p: 1,
                      }}
                    >
                      {item.label}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "initial",
                        color: "text.secondary",
                        width: "100%",
                        p: 1,
                      }}
                    >
                      {item.value || "Sin Información"}
                    </Typography>
                  </Box>
                ))}
              </Paper>
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
}
export default AstViewer;
