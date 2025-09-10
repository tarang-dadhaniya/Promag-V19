import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { getRequestT } from "./i18n";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (req, res) => {
    const ping = process.env.PING_MESSAGE;
    if (ping) return res.json({ message: ping });
    const { getRequestT } = require("./i18n");
    const t = getRequestT(req);
    res.json({ message: t("api.ping") });
  });

  app.get("/api/demo", handleDemo);

  return app;
}
