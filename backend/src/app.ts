import cors from "cors";
import express from "express";
import { adminRouter } from "./modules/admin/admin.controller";
import { brandsRouter } from "./modules/brands/brands.controller";
import { racketsRouter } from "./modules/rackets/rackets.controller";
import { recommendationRouter } from "./modules/recommendation/recommendation.controller";
import { sessionsRouter } from "./modules/sessions/sessions.controller";

export function createApp() {
  const app = express();

  const allowedOrigins = (process.env.CORS_ORIGINS ?? "http://localhost:3000")
    .split(",")
    .map((o) => o.trim());

  app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "X-API-Key"]
  }));
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/rackets", racketsRouter);
  app.use("/api/recommendations", recommendationRouter);
  app.use("/api/brands", brandsRouter);
  app.use("/api/sessions", sessionsRouter);
  app.use("/api/admin", adminRouter);

  app.use((error: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    // eslint-disable-next-line no-console
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  });

  return app;
}
