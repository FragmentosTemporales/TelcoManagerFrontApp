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
import ObjetivosView from "./views/Objetivos";
import ProyectosView from "./views/Proyectos";
import AsignadosView from "./views/AsignadosView";
import Asignado from "./views/AsignadoView";
import FormAstCreate from "./views/FormAstView";
import FormAstList from "./views/AstListView";
import AstViewer from "./views/AstFormView";
import SuccessView from "./views/SuccessView";
import ComponenteAsignadoView from "./views/ComponenteAsignadoView";
import Footer from "./components/footer";
import Settings from "./views/Settings";

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
          <Route path="/objetivos" element={<ObjetivosView />} />
          <Route path="/proyectos" element={<ProyectosView />} />
          <Route path="/asignados" element={<AsignadosView />} />
          <Route path="/asignado/:proyectoID" element={<Asignado />} />
          <Route path="/form-ast" element={<FormAstCreate />} />
          <Route path="/form-ast-list" element={<FormAstList />} />
          <Route path="/formulario-ast/:formID" element={<AstViewer />} />
          <Route path="/success" element={<SuccessView/>} />
          <Route path="/configuraciones" element={<Settings/>} />
          <Route path="/componente-asignado/:componenteID" element={<ComponenteAsignadoView/>} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}

export default App;
