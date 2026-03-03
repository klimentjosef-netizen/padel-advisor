import { Router } from "express";
import { recommendationSchema } from "../../shared/schemas";
import { recommendationService } from "./recommendation.service";
import { asyncHandler } from "../../shared/async-handler";

export const recommendationRouter = Router();

recommendationRouter.post("/", asyncHandler(async (req, res) => {
  const parsed = recommendationSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ errors: parsed.error.flatten() });
    return;
  }

  const response = await recommendationService.recommendAndPersist(parsed.data, 5);
  res.json(response);
}));
