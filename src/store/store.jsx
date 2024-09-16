import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import userReducer from "../slices/userSlice";
import ccpaReducer from "../slices/ccpaSlice";
import ccpReducer from "../slices/ccpSlice";
import ccReducer from "../slices/ccSlice";
import cargoReducer from "../slices/cargoSlice";
import mpReducer from "../slices/mpSlice";
import personaReducer from "../slices/personaSlice";
import areaReducer from "../slices/areaSlice";
import motivoReducer from "../slices/motivoSlice";
import smReducer from "../slices/smSlice";
import solicitudReducer from "../slices/solicitudSlice";
import seReducer from "../slices/seSlice"
import sgReducer from "../slices/sgSlice"
import formReducer from "../slices/formSlice"
import notificacionReducer from "../slices/notificacionSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    ccpa: ccpaReducer,
    ccp: ccpReducer,
    cc: ccReducer,
    cargo: cargoReducer,
    mp: mpReducer,
    persona: personaReducer,
    area: areaReducer,
    motivo: motivoReducer,
    sm: smReducer,
    solicitud: solicitudReducer,
    se: seReducer,
    sg: sgReducer,
    form: formReducer,
    notificacion: notificacionReducer
  },
});
