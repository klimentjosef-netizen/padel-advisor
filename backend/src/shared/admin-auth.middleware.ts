import { Request, Response, NextFunction } from "express";

export function requireAdminKey(req: Request, res: Response, next: NextFunction): void {
  const adminKey = process.env.ADMIN_API_KEY;
  if (!adminKey) {
    res.status(503).json({ message: "Admin API is not configured" });
    return;
  }

  const provided = req.headers["x-api-key"];
  if (provided !== adminKey) {
    res.status(401).json({ message: "Invalid or missing API key" });
    return;
  }

  next();
}
