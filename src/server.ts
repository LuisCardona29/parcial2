import express, { Application } from "express";
import morgan from "morgan";
import cors from "cors";

import { sequelize } from "./database/db";

/* IMPORT MODELS */
import "./models/Car";
import "./models/Tuition";

/* IMPORT FAKER */
import { populateData } from "./faker/populate_data";

/* IMPORT ROUTES */
import { CarRoutes } from "./routes/car";
import { TuitionRoutes } from "./routes/tuition";

class Server {

  public app: Application;

  constructor() {

    this.app = express();

    this.config();
    this.routes();

  }

  config(): void {

    this.app.set("port", process.env.PORT || 3000);

    this.app.use(cors());
    this.app.use(morgan("dev"));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

  }

  routes(): void {

    const carRoutes = new CarRoutes();
    carRoutes.routes(this.app);

    const tuitionRoutes = new TuitionRoutes();
    tuitionRoutes.routes(this.app);

  }

  async start(): Promise<void> {

    try {

      /* DATABASE CONNECTION */

      await sequelize.authenticate();

      console.log("✅ Database connected");

      /* CREATE TABLES */

      await sequelize.sync({ alter: true });

      console.log("✅ Tables synchronized");

      /* POPULATE DATABASE */

      await populateData();

      /* START SERVER */

      this.app.listen(this.app.get("port"), () => {

        console.log(`🚀 Server running on port ${this.app.get("port")}`);

      });

    } catch (error) {

      console.error("❌ Database connection error:", error);

    }

  }

}

const server = new Server();

server.start();