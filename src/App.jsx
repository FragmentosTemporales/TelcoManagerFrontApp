import { HashRouter, Routes, Route } from "react-router-dom";
import PrivateRoutes from "./utils/PrivateRoutes";
import CreateArea from "./views/CreateArea";
import Home from "./views/Home";
import Login from "./views/Login";
import Solicitudes from "./views/Solicitudes";
import Solicitud from "./views/Solicitud";
import FormFlota from "./views/CreateFormFlota";
import FormPrevencion from "./views/CreateFormPrevencion";
import FormCalidad from "./views/CreateFormCalidad";
import FormRRHH from "./views/CreateFormRRHH";
import FormOperaciones from "./views/CreateFormOperaciones";
import FormLogistica from "./views/CreateFormLogistica";
import ReversaView from "./views/Reversa";
import ObjetivosView from "./views/Objetivos";
import FormAstList from "./views/AstListView";
import AstViewer from "./views/AstFormView";
import Settings from "./views/Settings";
import BodegaViewer from "./views/BodegaView";
import BodegaQuintaViewer from "./views/BodegaQuintaView";
import AtencionTotem from "./views/AtencionTotem";
import SupervisorViewRM from "./views/SupervisorViewRM";
import AgendamientoViewer from "./views/AgendamientoView";
import AllAgendamientoViewer from "./views/AllAgendamientosView";
import AmonesatacionesViewer from "./views/AmonestacionesUserView";
import ErrorHandler from "./utils/404NotFound";
import ProyectosOnNetView from "./views/ProyectosConsolidadosView";
import ProyectoConsolidadoView from "./views/ProyectoConsolidadoView";
import LoadConstruccion from "./views/PlanillaConstruccion";
import TicketeraView from "./views/CreateTicket";
import GestorTicketera from "./views/GestionTickets";
import TicketViewer from "./views/TicketView";
import CreateMigracionesProactivas from "./views/CreateMigracionesProactivas";
import MigracionesViewer from "./views/MigracionesView";
import ProyectoInternoView from "./views/Proyecto_InternoView";
import NDCSinConsumoUpdate from "./views/NdcSinConsumoView";
import CreateProyectoInterno from "./views/CreateProyectoInterno";
import LogQueryStats from "./views/LogQueryStatsView";
import NDCErrorConConsumo from "./views/NdcErrorConConsumoView";
import NDCLogsError from "./views/NdcLogsErrorsView";
import NDCSessionLogs from "./views/NdcSessionLogsView";
import CreateReparacionView from "./views/CreateReparacion";
import ReparacionesView from "./views/ReparacionesView";
import InventarioView from "./views/InventarioView";
import CreateTareaInterna from "./views/CreateTarea";
import LatestLogsView from "./views/LatestLogsView";
import ProyectosAsignados from "./views/ProyectosAsignados";
import ProyectoFiltrado from "./views/ProyectoFiltrado";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<Home />} />
          <Route path="/mis-solicitudes" element={<AmonesatacionesViewer />} />
          <Route path="/modulo:solicitudes" element={<Solicitudes />} />
          <Route path="/solicitud/:solicitud_id" element={<Solicitud />} />
          <Route path="/create" element={<CreateArea />} />
          <Route path="/FLOTA/:logID" element={<FormFlota />} />
          <Route path="/PREVENCION/:logID" element={<FormPrevencion />} />
          <Route path="/CALIDAD TECNICA/:logID" element={<FormCalidad />} />
          <Route path="/RECURSOS HUMANOS/:logID" element={<FormRRHH />} />
          <Route path="/OPERACIONES/:logID" element={<FormOperaciones />} />
          <Route path="/LOGISTICA/:logID" element={<FormLogistica />} />
          <Route path="/modulo:reversa" element={<ReversaView />} />
          <Route path="/objetivos" element={<ObjetivosView />} />
          <Route path="/form-ast-list" element={<FormAstList />} />
          <Route path="/formulario-ast/:formID" element={<AstViewer />} />
          <Route path="/configuraciones" element={<Settings />} />
          <Route path="/totem" element={<AtencionTotem />} />
          <Route path="/supervisor" element={<SupervisorViewRM />} />
          <Route path="/agendamientos" element={<AgendamientoViewer />} />
          <Route path="/all_agendamientos" element={<AllAgendamientoViewer />} />
          <Route path="/proyectos-onnet" element={<ProyectosOnNetView />} />
          <Route path="/consolidado/:id" element={<ProyectoConsolidadoView />} />
          <Route path="/carga-construccion" element={<LoadConstruccion />} />
          <Route path="/modulo:ticketera" element={<TicketeraView />} />
          <Route path="/modulo:gestion-ticketera" element={<GestorTicketera />} />
          <Route path="/ticketviewer/:logID" element={<TicketViewer />} />
          <Route path="/modulo:create-migracion-proactiva" element={<CreateMigracionesProactivas />} />
          <Route path="/modulo:migraciones-proactivas" element={<MigracionesViewer />} />

          <Route path="/modulo:ultimos-logs" element={<LatestLogsView />} />

          <Route path="/modulo:proyecto-interno" element={<ProyectoInternoView />} />
          <Route path="/modulo:crear-proyecto-interno/:proyecto_id?" element={<CreateProyectoInterno />} />
          <Route path="/modulo:crear-tarea-interna/:proyecto_id" element={<CreateTareaInterna />} />

          <Route path="/modulo:registro-reparacion" element={<CreateReparacionView />} />
          <Route path="/modulo:reparaciones" element={<ReparacionesView />} />

          <Route path="/modulo:ndc/pendientes-sin-consumo" element={<NDCSinConsumoUpdate />} />
          <Route path="/modulo:ndc/error-stock-consumo" element={<NDCErrorConConsumo />} />
          <Route path="/modulo:ndc/logs-errors" element={<NDCLogsError />} />
          <Route path="/modulo:ndc/session-logs" element={<NDCSessionLogs />} />

          <Route path="/modulo:log-query" element={<LogQueryStats />} />
          <Route path="/modulo:inventario" element={<InventarioView />} />

          <Route path="/modulo:proyectos-asignados" element={<ProyectosAsignados />} />
          <Route path="/modulo:proyecto-filtrado/:proyecto_id" element={<ProyectoFiltrado />} />

        </Route>
        <Route path="/bodegaRM" element={<BodegaViewer />} />
        <Route path="/bodegaQuinta" element={<BodegaQuintaViewer />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<ErrorHandler/>} />
      </Routes>
  </HashRouter>
  );
}

export default App;
