import express from "express";

const router = express.Router();

router.get("/price", (req, res) => {
  const supply = Number(req.query.supply) || 1000;
  const price = 0.01 + 0.001 * supply;
  res.json({ price });
});

export default router;
