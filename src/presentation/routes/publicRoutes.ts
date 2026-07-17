import { Router } from "express";
import { PublicController } from "../controllers/PublicController";

export function publicRoutes(publicController: PublicController) {
  const router = Router();

  router.get("/stats", publicController.getStats);

  return router;
}
