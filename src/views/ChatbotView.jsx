import {
  Alert,
  Box,
  Card,
  CardContent,
  CardHeader,
  Button,
  TextField,
  InputAdornment,
  Paper,
  Rating,
  Typography,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import CampaignIcon from "@mui/icons-material/Campaign";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createChat, createChatValue } from "../api/chatbotAPI";

function ChatBotViewer() {
  const authState = useSelector((state) => state.auth);
  const { token, user_id } = authState;
  const [form, setForm] = useState({ query: "" });
  const [formValueChat, setFormValueChat] = useState({ comentario: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [chatResponse, setChatResponse] = useState(undefined);
  const [value, setValue] = useState(3);
  const [visible, setVible] = useState(undefined);
  const [enlace, setEnlace] = useState(null);

  const chatBot = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setChatResponse(undefined);
    setEnlace(null);
    setVible(undefined);
  
    const payload = { query: form.query };
    try {
      const res = await createChat(payload, token);
      setChatResponse(res);
      const chatResponse = procesarRespuesta(res);
      setVible(chatResponse);
    } catch (error) {
      alert("Error al enviar la consulta.");
    }
    setIsSubmitting(false);
  };

  const chatBotValue = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const payload = {
      comentario: formValueChat.comentario,
      value: value,
      userID: user_id,
      pregunta: form.query,
      respuesta: chatResponse,
    };
    try {
      const response = await createChatValue(payload, token);
      alert(response.message);
    } catch (error) {
      alert("Error al enviar el comentario.");
    }
    setFormValueChat({ comentario: "" });
    setForm({ query: "" });
    setChatResponse(undefined);
    setValue(3);
    setIsSubmitting(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleChangeValueChat = (e) => {
    const { name, value } = e.target;
    setFormValueChat((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const procesarRespuesta = (respuesta) => {
    if (!respuesta || typeof respuesta !== "object") {
      return "El formato de respuesta no es válido.";
    }

    // Extraer 'Link' y 'ID consulta', y omitirlos del objeto
    const { ["ID consulta"]: idConsultaOmitida, Link, ...sinId } = respuesta;

    // Actualizar el estado 'enlace' si 'Link' tiene un valor válido
    if (Link && Link !== "No aplica") {
      setEnlace(Link);
    }

    // Filtrar claves cuyos valores no sean 'No aplica'
    const filtrado = Object.entries(sinId).filter(
      ([_, valor]) => valor !== "No aplica"
    );

    // Convertir el objeto filtrado a una cadena de texto
    const resultado = filtrado
      .map(([clave, valor]) => `${clave}: ${valor}`)
      .join("\n");

    return resultado;
  };

  const chatInput = () => (
    <Card
      sx={{
        borderRadius: 5,
        width: { lg: "60%", md: "70%", sm: "90%", xs: "90%" },
        boxShadow: 5,
        display: "flex",
        flexDirection: "column",
        marginTop: "60px",
        marginBottom: "20px",
        minHeight: "150px",
      }}
    >
      <CardHeader
        title={
          <Typography fontWeight="bold" sx={{ fontFamily: "initial" }}>
            Soporte
          </Typography>
        }
        sx={{
          background: "#0b2f6d",
          color: "white",
          textAlign: "end",
        }}
        avatar={<ContactSupportIcon />}
      />
      <CardContent>
        <form onSubmit={chatBot}>
          <Box
            sx={{
              mb: 2,
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 2,
              }}
            >
              <TextField
                required
                sx={{ width: { lg: "70%", md: "70%", sm: "90%", xs: "90%" } }}
                id="query"
                value={form.query}
                label="¿Alguna pregunta?"
                type="text"
                name="query"
                variant="outlined"
                onChange={handleChange}
              />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                sx={{ background: "#0b2f6d", marginLeft: 2 }}
              >
                {isSubmitting ? "Procesando..." : "Consultar"}
              </Button>
            </Box>
          </Box>
        </form>
      </CardContent>
    </Card>
  );

  const chatOutput = () => (
    <Card
      sx={{
        borderRadius: 5,
        width: { lg: "60%", md: "70%", sm: "90%", xs: "90%" },
        boxShadow: 5,
        display: "flex",
        flexDirection: "column",
        marginBottom: "20px",
        minHeight: "150px",
      }}
    >
      <CardHeader
        sx={{
          background: "#0b2f6d",
          color: "white",
          textAlign: "end",
        }}
        avatar={<ChatIcon />}
      />
      <CardContent
        sx={{
          flexGrow: 1, // Permite que el contenido crezca y ocupe el espacio restante
          overflow: "auto", // Habilita el scroll automático
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Typography
            fontWeight="bold"
            sx={{
              fontFamily: "initial",
              p: 1,
              width: "90%",
              overflow: "hidden", // Oculta contenido adicional horizontalmente si es necesario
              whiteSpace: "pre-wrap", // Permite saltos de línea para mantener la legibilidad
            }}
          >
            {visible || "No hay información disponible."}
      {enlace && (
        <>
          <br />
          Para mayor información, por favor consulte el siguiente enlace:{" "}
          <a href={enlace} target="_blank" rel="noopener noreferrer">
            {enlace}
          </a>
        </>
      )}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  const chatValue = () => (
    <Card
      sx={{
        borderRadius: 5,
        width: { lg: "60%", md: "70%", sm: "90%", xs: "90%" },
        boxShadow: 5,
        marginBottom: "20px",
        overflow: "auto",
      }}
    >
      <CardHeader
        sx={{
          background: "#0b2f6d",
          color: "white",
          textAlign: "end",
        }}
        avatar={<CampaignIcon />}
      />
      <CardContent>
        <form onSubmit={chatBotValue}>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography
              fontWeight="bold"
              sx={{
                fontFamily: "initial",
                overflow: "hidden",
                whiteSpace: "pre-wrap",
                textAlign: "center",
              }}
            >
              Ayúdanos a mejorar, por favor califica la respuesta.
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginTop: 2,
              }}
            >
              <Rating
                required
                name="simple-controlled"
                value={value}
                size="large"
                onChange={(event, newValue) => {
                  setValue(newValue);
                }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginTop: 2,
                width: "100%",
              }}
            >
              <TextField
                required
                onChange={handleChangeValueChat}
                name="comentario"
                value={formValueChat.comentario}
                sx={{ width: "90%" }}
                label="Comentario"
                multiline
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginTop: 2,
              }}
            >
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                sx={{ background: "#0b2f6d", marginLeft: 2 }}
              >
                {isSubmitting ? "Procesando..." : "Enviar"}
              </Button>
            </Box>
          </Box>
        </form>
      </CardContent>
    </Card>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background: "white",
        alignItems: "center",
        height: "100vh",
      }}
    >
      {chatInput()}
      {chatResponse ? chatOutput() : null}
      {chatResponse ? chatValue() : null}
    </Box>
  );
}

export default ChatBotViewer;
