import { Router } from "express";
import { TuitionRoutes } from "./tuition";
import { CarRoutes } from "./car";

export class Routes {
// agrega tus rutas aquí de la siguiente manera
public carRoutes: CarRoutes = new CarRoutes();
public tuitionRoutes: TuitionRoutes = new TuitionRoutes();

}

