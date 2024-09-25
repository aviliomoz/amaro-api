import "dotenv/config";
import express, { type Express } from "express";
import cookieParser from "cookie-parser";
import { corsConfig } from "./config/cors";
import { ApiRouter } from "./routes/api.route";

const app: Express = express();

app.use(corsConfig());
app.use(cookieParser());
app.use(express.json());

app.use("/api", ApiRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[server] Server running at http://localhost:${PORT}`);
});
