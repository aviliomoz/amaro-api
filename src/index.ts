import express, { type Express } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { corsConfig } from "./config/cors";
import api from "./routes/api.routes";
import { connect } from "mongoose";

dotenv.config({ path: ".env" });

const app: Express = express();

app.use(corsConfig());
app.use(cookieParser());
app.use(express.json());

app.use("/api", api);

const PORT = process.env.PORT || 5000;

connect(process.env.DATABASE_URL!).then(() => {
  console.log("[database] Database connected");
  app.listen(PORT, () => {
    console.log(`[server] Server running at http://localhost:${PORT}`);
  });
});
