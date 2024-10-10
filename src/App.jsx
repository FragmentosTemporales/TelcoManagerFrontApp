import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoutes from "./utils/PrivateRoutes";
import CreateArea from "./views/CreateArea";
import Home from "./views/Home";
import Login from "./views/Login";
import Navbar from "./components/navbar";
import Solicitudes from "./views/Solicitudes";
import Solicitud from "./views/Solicitud";
import FormFlota from "./views/CreateFormFlota";
import FormPrevencion from "./views/CreateFormPrevencion";
import FormCalidad from "./views/CreateFormCalidad";
import FormRRHH from "./views/CreateFormRRHH";
import FormOperaciones from "./views/CreateFormOperaciones";
import FormLogistica from "./views/CreateFormLogistica";
import NotificacionesView from "./views/Notificaciones";
import ReversaView from "./views/Reversa";
import Charts from "./views/Charts";
import CreateZone from "./views/CreateZone";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<Home />} />
          <Route path="/charts" element={<Charts/>}/>
          <Route path="/solicitudes" element={<Solicitudes />} />
          <Route path="/solicitud/:solicitud_id" element={<Solicitud />} />
          <Route path="/create" element={<CreateArea />} />
          <Route path="/FLOTA/:logID" element={<FormFlota />} />
          <Route path="/PREVENCION/:logID" element={<FormPrevencion />} />
          <Route path="/CALIDAD TECNICA/:logID" element={<FormCalidad />} />
          <Route path="/RECURSOS HUMANOS/:logID" element={<FormRRHH />} />
          <Route path="/OPERACIONES/:logID" element={<FormOperaciones />} />
          <Route path="/LOGISTICA/:logID" element={<FormLogistica />} />
          <Route path="/notificaciones" element={<NotificacionesView />} />
          <Route path="/reversa" element={<ReversaView />} />
          <Route path="/createzone" element={<CreateZone />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
