import { HashRouter, Routes, Route } from "react-router-dom";
import {PrivateRoutes, ErrorHandler} from "./utils";
import {
  AgendamientoViewer
  ,AllAgendamientoViewer
  ,AmonesatacionesViewer
  ,AstViewer
  ,AtencionTotem
  ,BodegaQuintaViewer
  ,BodegaViewer
  ,CreateArea
  ,CreateMigracionesProactivas
  ,CreateProyectoInterno
  ,CreateReparacionView
  ,CreateTareaInterna
  ,FormulariosCalidadReactiva
  ,FormAstList
  ,FormCalidad
  ,FormRRHH
  ,FormFlota
  ,FormLogistica
  ,FormOperaciones
  ,FormPrevencion
  ,GestorTicketera
  ,Home
  ,InventarioView
  ,LatestLogsView
  ,LogQueryStats
  ,LoadConstruccion
  ,Login
  ,MigracionesViewer
  ,NDCLogsError
  ,NDCSessionLogs
  ,NDCSinConsumoUpdate
  ,NDCErrorConConsumo
  ,OnnetComponente
  ,ObjetivosView
  ,OnnetProyecto
  ,OnnetProyectos
  ,OnnetFormularioComponentes
  ,ProyectoFiltradoCubicado
  ,ProyectoFiltradoVNO
  ,ProyectosLinkVNOView
  ,ProyectoInternoView
  ,ProyectosOnNetView
  ,ReparacionesInfoEdit
  ,RepaView
  ,ReparacionesView
  ,RespaldoView
  ,RespaldosView
  ,ReversaView
  ,Settings
  ,Solicitud
  ,Solicitudes
  ,SupervisorViewRM
  ,TicketeraView
  ,TicketViewer
} from "./views";

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
          <Route path="/modulo:repa/:orden" element={<RepaView />} />
          <Route path="/modulo:reparacionesinfo" element={<ReparacionesInfoEdit />} />

          <Route path="/modulo:respaldos" element={<RespaldosView />} />
          <Route path="/modulo:respaldo/:orden" element={<RespaldoView />} />

          <Route path="/modulo:ndc/pendientes-sin-consumo" element={<NDCSinConsumoUpdate />} />
          <Route path="/modulo:ndc/error-stock-consumo" element={<NDCErrorConConsumo />} />
          <Route path="/modulo:ndc/logs-errors" element={<NDCLogsError />} />
          <Route path="/modulo:ndc/session-logs" element={<NDCSessionLogs />} />

          <Route path="/modulo:log-query" element={<LogQueryStats />} />
          <Route path="/modulo:inventario" element={<InventarioView />} />

          <Route path="/proyectos-onnet" element={<ProyectosOnNetView />} />
          <Route path="/proyectos-link-vno" element={<ProyectosLinkVNOView />} />
          <Route path="/modulo:proyecto-filtrado-cubicado/:proyecto_id" element={<ProyectoFiltradoCubicado />} />
          <Route path="/modulo:proyecto-filtrado-vno/:proyecto_id" element={<ProyectoFiltradoVNO />} />

          <Route path="/onnet/modulo/proyectos" element={<OnnetProyectos />} />
          <Route path="/onnet/modulo/proyecto/:proyecto_id" element={<OnnetProyecto />} />
          <Route path="onnet/modulo/formulario-construccion" element={<OnnetFormularioComponentes />} />
          <Route path="/onnet/modulo/componente/:componente_id" element={<OnnetComponente />} />

          <Route path="/modulo:formulario-calidad-reactiva" element={<FormulariosCalidadReactiva />} />

        </Route>

        <Route path="/bodegaRM" element={<BodegaViewer />} />
        <Route path="/bodegaQuinta" element={<BodegaQuintaViewer />} />

        <Route path="/loginPage" element={<Login />} />

        <Route path="*" element={<ErrorHandler/>} />

      </Routes>

  </HashRouter>
  );
}

export default App;
