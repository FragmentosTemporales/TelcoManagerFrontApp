import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getNumeros } from "../api/totemAPI";
import { playAlertSound } from "../helpers/sounds";

function BodegaQuintaViewer() {
  const [dataBodega, setDataBodega] = useState([]);
  const [dataLogistica, setDataLogistica] = useState([]);
  const [atencionBodega, setAtencionBodega] = useState([]);
  const [atencionLogistica, setAtencionLogistica] = useState([]);
  const [esperaBodega, setEsperaBodega] = useState([]);
  const [esperaLogistica, setEsperaLogistica] = useState([]);
  const estilo = {fontSize: "1rem", paddingTop: "5px", paddingBot:"5px"}


  const fetchData = async () => {
    try {
      const response = await getNumeros();
      const filteredDataBodega = response.filter(
        (item) => item.Estacion_ID === 401
      );
      const filteredDataLogistica = response.filter(
        (item) => item.Estacion_ID === 301
      );

      setDataBodega(filteredDataBodega);
      setDataLogistica(filteredDataLogistica);
    } catch (error) {
      console.log(error);
    }
  };

  const set_interval = () => {
    return (esperaBodega.length > 0 && esperaLogistica.length > 0) ? 4000 : 10000;
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchData();
    }, set_interval());
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const NewAtencionBodega = dataBodega.filter(
      (item) => item.Estado === "En atención"
    );
    verificarAtencion(NewAtencionBodega, 1);
    setAtencionBodega(NewAtencionBodega);
    setEsperaBodega(dataBodega.filter((item) => item.Estado === "En espera"));
  }, [dataBodega]);

  useEffect(() => {
    const NewAtencionLogistica = dataLogistica.filter(
      (item) => item.Estado === "En atención"
    );
    verificarAtencion(NewAtencionLogistica, 2);
    setAtencionLogistica(NewAtencionLogistica);

    setEsperaLogistica(
      dataLogistica.filter((item) => item.Estado === "En espera")
    );
  }, [dataLogistica]);

  const verificarAtencion = (data, flag) => {
    if (flag === 1) {
        if (JSON.stringify(atencionBodega) !== JSON.stringify(data) && JSON.stringify(data).length > 0) {
            playAlertSound();
        }
    } else if (flag === 2) {
        if (JSON.stringify(atencionLogistica) !== JSON.stringify(data) && JSON.stringify(data).length > 0) {
            playAlertSound();
        }
    }
};


const AtencionBodegaCard = ({ atencionBodega }) => (
  <Card
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        m: 1,
      }}
    >
      <CardHeader
        title={
          <Typography
            variant="h6"
          >
          EN ATENCIÓN BODEGA
        </Typography>
      }
      sx={{
        background: "#0b2f6d",
        color: "white",
        textAlign: "center",
        padding: "8px",
      }}
    />
    <CardContent>
      {atencionBodega && atencionBodega.length > 0 ? (
        <Grid container spacing={2}>
          {/* Primera columna */}
          <Grid item xs={12}>
            {atencionBodega
              .map((item, index) => (
                <Paper
                  elevation={2}
                  key={`col1-${index}`}
                  sx={{
                    padding: "10px",
                    margin: "10px auto",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <Grid container spacing={1}>
                  <Grid item xs={12}  sx={{display:'flex'}}>
                    <Grid item xs={3}>
                      <Typography
                        variant="body2"
                        color="text.primary"
                        sx={{
                          fontSize: "2rem",
                          paddingTop: "1px",
                          paddingBot: "1px",
                          textAlign: "center",
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        N° {item.Numero}
                      </Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <Typography
                        variant="body2"
                        color="text.primary"
                        sx={{
                          fontSize: "2rem",
                          paddingTop: "3px",
                          paddingBot: "3px",
                          textAlign: "center",
                        }}
                      >
                        {item.nombre}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          fontSize: "1rem",
                          paddingTop: "3px",
                          paddingBot: "3px",
                          textAlign: "center",
                        }}
                      >
                        Proceso: {item.Proceso}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          fontSize: "1rem",
                          paddingTop: "3px",
                          paddingBot: "3px",
                          textAlign: "center",
                        }}
                      >
                        Atiende: {item.Atendedor}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                </Paper>
              ))}
          </Grid>
        </Grid>
      ) : (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: "1rem" }}
        >
          No hay personas en atención
        </Typography>
      )}
    </CardContent>
  </Card>
);

const AtencionLogisticaCard = ({ atencionLogistica }) => (
  <Card
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        m: 1,
      }}
    >
      <CardHeader
        title={
          <Typography
            variant="h6"
          >
          EN ATENCIÓN LOGÍSTICA
        </Typography>
      }
      sx={{
        background: "#0b2f6d",
        color: "white",
        textAlign: "center",
        padding: "8px",
      }}
    />
    <CardContent>
      {atencionLogistica && atencionLogistica.length > 0 ? (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {atencionLogistica.map((item, index) => (
              <Paper
                elevation={2}
                key={`col1-${index}`}
                sx={{
                  padding: "10px",
                  margin: "10px auto",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <Grid container spacing={1}>
                  <Grid item xs={12}  sx={{display:'flex'}}>
                    <Grid item xs={3}>
                      <Typography
                        variant="body2"
                        color="text.primary"
                        sx={{
                          fontSize: "2rem",
                          paddingTop: "1px",
                          paddingBot: "1px",
                          textAlign: "center",
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        N° {item.Numero}
                      </Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <Typography
                        variant="body2"
                        color="text.primary"
                        sx={{
                          fontSize: "2rem",
                          paddingTop: "3px",
                          paddingBot: "3px",
                          textAlign: "center",
                        }}
                      >
                        {item.nombre}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          fontSize: "1rem",
                          paddingTop: "3px",
                          paddingBot: "3px",
                          textAlign: "center",
                        }}
                      >
                        Proceso: {item.Proceso}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          fontSize: "1rem",
                          paddingTop: "3px",
                          paddingBot: "3px",
                          textAlign: "center",
                        }}
                      >
                        Atiende: {item.Atendedor}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </Grid>
        </Grid>
      ) : (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: "1rem" }}
        >
          No hay personas en atención
        </Typography>
      )}
    </CardContent>
  </Card>
);

const EsperaBodegaCard = ({ esperaBodega }) => (
  <Card
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        m: 1,
      }}
    >
      <CardHeader
        title={
          <Typography
            variant="h6"
          >
          EN ESPERA BODEGA
        </Typography>
      }
      sx={{
        background: "#0b2f6d",
        color: "white",
        textAlign: "center",
        padding: "8px",
      }}
    />
    <CardContent>
      {esperaBodega && esperaBodega.length > 0 ? (
        <Grid container spacing={2}>
          {/* Primera columna */}
          <Grid item xs={6}>
            {esperaBodega
              .filter((_, index) => index % 2 === 0) // Filtra los elementos en posiciones pares para la columna izquierda
              .map((item, index) => (
                <Paper
                  elevation={2}
                  key={`col1-${index}`}
                  sx={{
                    padding: "10px",
                    margin: "10px auto",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <Grid container spacing={1}>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary" sx={estilo}>
                        Proceso:
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={estilo}>
                        Número:
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={estilo}>
                        Nombre:
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body2" color="text.primary" sx={estilo}>
                        {item.Proceso}
                      </Typography>
                      <Typography variant="body2" color="text.primary" sx={estilo}>
                        {item.Numero}
                      </Typography>
                      <Typography variant="body2" color="text.primary" sx={estilo}>
                        {item.nombre}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
          </Grid>
          {/* Segunda columna */}
          <Grid item xs={6}>
            {esperaBodega
              .filter((_, index) => index % 2 !== 0) // Filtra los elementos en posiciones impares para la columna derecha
              .map((item, index) => (
                <Paper
                  elevation={2}
                  key={`col2-${index}`}
                  sx={{
                    padding: "10px",
                    margin: "10px auto",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <Grid container spacing={1}>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary" sx={estilo}>
                        Proceso:
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={estilo}>
                        Número:
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={estilo}>
                        Nombre:
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body2" color="text.primary" sx={estilo}>
                        {item.Proceso}
                      </Typography>
                      <Typography variant="body2" color="text.primary" sx={estilo}>
                        {item.Numero}
                      </Typography>
                      <Typography variant="body2" color="text.primary" sx={estilo}>
                        {item.nombre}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
          </Grid>
        </Grid>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{fontSize: "1rem"}}>
          No hay personas en espera
        </Typography>
      )}
    </CardContent>
  </Card>
);

const EsperaLogisticaCard = ({ esperaLogistica }) => (
  <Card
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        m: 1,
      }}
    >
      <CardHeader
        title={
          <Typography
            variant="h6"
          >
          EN ESPERA LOGÍSTICA
        </Typography>
      }
      sx={{
        background: "#0b2f6d",
        color: "white",
        textAlign: "center",
        padding: "8px",
      }}
    />
    <CardContent>
      {esperaLogistica && esperaLogistica.length > 0 ? (
        <Grid container spacing={2}>
          {/* Primera columna */}
          <Grid item xs={6}>
            {esperaLogistica
              .filter((_, index) => index % 2 === 0) // Filtra los elementos en posiciones pares para la columna izquierda
              .map((item, index) => (
                <Paper
                  elevation={2}
                  key={`col1-${index}`}
                  sx={{
                    padding: "10px",
                    margin: "10px auto",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <Grid container spacing={1}>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary" sx={estilo}>
                        Proceso:
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={estilo}>
                        Número:
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={estilo}>
                        Nombre:
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body2" color="text.primary" sx={estilo}>
                        {item.Proceso}
                      </Typography>
                      <Typography variant="body2" color="text.primary" sx={estilo}>
                        {item.Numero}
                      </Typography>
                      <Typography variant="body2" color="text.primary" sx={estilo}>
                        {item.nombre}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
          </Grid>
          {/* Segunda columna */}
          <Grid item xs={6}>
            {esperaLogistica
              .filter((_, index) => index % 2 !== 0) // Filtra los elementos en posiciones impares para la columna derecha
              .map((item, index) => (
                <Paper
                  elevation={2}
                  key={`col2-${index}`}
                  sx={{
                    padding: "10px",
                    margin: "10px auto",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <Grid container spacing={1}>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary" sx={estilo}>
                        Proceso:
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={estilo}>
                        Número:
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={estilo}>
                        Nombre:
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body2" color="text.primary" sx={estilo}>
                        {item.Proceso}
                      </Typography>
                      <Typography variant="body2" color="text.primary" sx={estilo}>
                        {item.Numero}
                      </Typography>
                      <Typography variant="body2" color="text.primary" sx={estilo}>
                        {item.nombre}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
          </Grid>
        </Grid>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{fontSize: "1rem"}}>
          No hay personas en espera
        </Typography>
      )}
    </CardContent>
  </Card>
);

return (
  <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background: "#f5f5f5",
        alignItems: "center",
        paddingY: "40px",
        minHeight: "90vh",
      }}
    >

    <Box sx={{ display: "flex", justifyContent: "space-evenly", width: "100%" }}>
      <CardContent sx={{width: "100%"}}>
        <AtencionLogisticaCard atencionLogistica={atencionLogistica} />
        <EsperaLogisticaCard esperaLogistica={esperaLogistica} />
      </CardContent>
      <CardContent sx={{width: "100%"}}>
        <AtencionBodegaCard atencionBodega={atencionBodega} />
        <EsperaBodegaCard esperaBodega={esperaBodega} />
      </CardContent>
    </Box>
  </Box>
);
}

export default BodegaQuintaViewer;
