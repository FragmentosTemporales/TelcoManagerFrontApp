import {
  Alert,
  Box,
  Button,
  Card,
  CardHeader,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  CardContent,
  Paper,
  Typography,
} from "@mui/material";

import GamepadIcon from "@mui/icons-material/Gamepad";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import { useState, useEffect } from "react";

function Charts() {
  const [vstar, setVstar] = useState(false);
  const [energy, setEnergy] = useState(false);
  const [support, setSupport] = useState(false);
  const [retira, setRetira] = useState(false);
  const [damage, setDamage] = useState(0);
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  function handleVstar() {
    setVstar(true);
  }
  function handleEnergy() {
    setEnergy(true);
  }
  function handleSupport() {
    setSupport(true);
  }
  function handleRetirada() {
    setRetira(true);
    setDamage(0)
  }

  function restart() {
    setEnergy(false);
    setSupport(false);
    setRetira(false);
  }

  function increaseDamage() {
    setDamage((prevDamage) => prevDamage + 10);
  }
  function decreaseDamage() {
    setDamage((prevDamage) => Math.max(prevDamage - 10, 0));
  }

  const btnVstar = () => (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        marginTop: 2,
      }}
    >
      <Button
        variant="contained"
        disabled={vstar}
        onClick={handleVstar}
        sx={{
          background: "#a88e02",
          height: "40px",
          width: "250px",
          fontWeight: "bold",
        }}
      >
        {" "}
        {vstar ? "VSTAR UTILIZADA" : "VSTAR"}{" "}
      </Button>
    </Box>
  );

  const btnEnergy = () => (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        marginTop: 2,
      }}
    >
      <Button
        variant="contained"
        color="error"
        disabled={energy}
        onClick={handleEnergy}
        sx={{ height: "40px", width: "250px", fontWeight: "bold" }}
      >
        {" "}
        {energy ? "ENERGIA CARGADA" : "ENERGIA"}
      </Button>
    </Box>
  );

  const btnSupport = () => (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        marginTop: 2,
      }}
    >
      <Button
        variant="contained"
        color="info"
        disabled={support}
        onClick={handleSupport}
        sx={{ height: "40px", width: "250px", fontWeight: "bold" }}
      >
        {" "}
        {support ? "SPORTE UTILIZADO" : "SOPORTE"}
      </Button>
    </Box>
  );

  const btnRetirada = () => (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        marginBottom: 2,
      }}
    >
      <Button
        variant="contained"
        color="info"
        disabled={retira}
        onClick={handleRetirada}
        sx={{ height: "40px", width: "250px", fontWeight: "bold" }}
      >
        {" "}
        {retira ? "POKEMON RETIRADO" : "RETIRAR"}
      </Button>
    </Box>
  );

  const btnRestart = () => (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        marginBottom: 2,
      }}
    >
      <Button
        variant="contained"
        color="primary"
        onClick={restart}
        sx={{ height: "40px", width: "250px", fontWeight: "bold" }}
      >
        {" "}
        TERMINAR TURNO
      </Button>
    </Box>
  );

  const contadorDamage = () => (
    <Box
      component={Paper}
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        padding: 2,
        margin: 2,
        boxShadow: 5,
      }}
    >
      <Typography
        variant="h4"
        color="text.secondary"
        fontFamily="monospace"
        sx={{ textAlign: "center" }}
      >
        DAÑO ACTIVO
      </Typography>
      <Typography
        variant="h2"
        fontFamily="monospace"
        sx={{ textAlign: "center" }}
      >
        {damage}
      </Typography>
      <Box
        sx={{ display: "flex", justifyContent: "center", gap: 2, marginTop: 2 }}
      >
        <Button
          variant="contained"
          color="error"
          onClick={decreaseDamage}
          sx={{ width: "100px" }}
        >
          -10
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={increaseDamage}
          sx={{ width: "100px" }}
        >
          +10
        </Button>
      </Box>
    </Box>
  );

  const timerControls = () => (
    <Box sx={{
      display: "flex",
      justifyContent: "center",
      gap: 2,
    }}>

    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        gap: 2,
        marginTop: 2,
        width:'250px'
      }}
    >
      <Button
        variant="contained"
        color="success"
        onClick={handleStartTimer}
        disabled={timerActive}
      >
        <PlayArrowIcon/>
      </Button>
      <Button
        variant="contained"
        color="warning"
        onClick={handlePauseTimer}
        disabled={!timerActive}
      >
        <PauseIcon/>
      </Button>
      <Button
        variant="contained"
        color="error"
        onClick={handleResetTimer}
      >
        <RotateLeftIcon/>
      </Button>
    </Box>
    </Box>
  );

  useEffect(() => {
    let interval;
    if (timerActive) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const handleStartTimer = () => setTimerActive(true);
  const handlePauseTimer = () => setTimerActive(false);
  const handleResetTimer = () => {
    setTimerActive(false);
    setTime(0);
  };

  const resetTimer = () => setTime(0);

  const formatTime = () => {
    const hours = String(Math.floor(time / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, "0");
    const seconds = String(time % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  const getTimerGradient = () => {
    // Cambiar color si supera 7 minutos (420 segundos)
    return time > 419
      ? "linear-gradient(to right, red, darkred)"
      : "linear-gradient(to right, #124fb9, #0b2f6d)";
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "70px",
      }}
    >
      <Card
        sx={{
          borderRadius: 0,
          width: { lg: "60%", md: "70%", sm: "90%", xs: "90%" },
          boxShadow: 5,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardHeader
          title={
            <Typography fontWeight="bold" sx={{ fontFamily: "initial" }}>
              TCG MANAGER
            </Typography>
          }
          sx={{
            background: "#0b2f6d",
            color: "white",
            textAlign: "end",
          }}
          avatar={<GamepadIcon />}
        />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: getTimerGradient(),
            color: "#fff",
            fontSize: "1.5rem",
            padding: "10px 20px",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
            minWidth: "150px",
            textAlign: "center",
            margin:2
          }}
        >
          <Typography fontWeight="bold">{formatTime()}</Typography>
        </Box>
        {timerControls()}
        {btnVstar()}
        {btnEnergy()}
        {btnSupport()}
        {contadorDamage()}
        {btnRetirada()}
        {btnRestart()}
      </Card>
    </Box>
  );
}

export default Charts;
