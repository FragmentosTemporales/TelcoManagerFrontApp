import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import userReducer from "../slices/userSlice";
import personaReducer from "../slices/personaSlice";
import motivoReducer from "../slices/motivoSlice";
import smReducer from "../slices/smSlice";
import solicitudReducer from "../slices/solicitudSlice";
import seReducer from "../slices/seSlice"
import sgReducer from "../slices/sgSlice"
import formReducer from "../slices/formSlice"
import notificacionReducer from "../slices/notificacionSlice"
import dominionReducer from "../slices/dominionSlice"
import asignadosReducer from "../slices/asignadosSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    persona: personaReducer,
    motivo: motivoReducer,
    sm: smReducer,
    solicitud: solicitudReducer,
    se: seReducer,
    sg: sgReducer,
    form: formReducer,
    notificacion: notificacionReducer,
    dominion: dominionReducer,
    asignados: asignadosReducer
  },
});
