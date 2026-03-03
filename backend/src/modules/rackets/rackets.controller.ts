import { Router } from "express";
import { compareSchema } from "../../shared/schemas";
import { racketsService } from "./rackets.service";
import { asyncHandler } from "../../shared/async-handler";

export const racketsRouter = Router();

racketsRouter.get("/", asyncHandler(async (_req, res) => {
  const rackets = await racketsService.listActive();
  const data = rackets.map((r) => ({
    id: r.id,
    brand: r.brand,
    model: r.model,
    price: r.price,
    weight: r.weight,
    balance: r.balance,
    hardness: r.hardness,
    shape: r.shape,
    image_url: r.image_url,
    description: r.description,
  }));

  res.json(data);
}));

racketsRouter.get("/:id", asyncHandler(async (req, res) => {
  const racket = await racketsService.getById(req.params.id);
  if (!racket) {
    res.status(404).json({ message: "Raketa nebyla nalezena" });
    return;
  }

  res.json(racket);
}));

racketsRouter.post("/compare", asyncHandler(async (req, res) => {
  const parsed = compareSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ errors: parsed.error.flatten() });
    return;
  }

  const rackets = await racketsService.compare(parsed.data.racket_ids);
  res.json({ rackets });
}));
