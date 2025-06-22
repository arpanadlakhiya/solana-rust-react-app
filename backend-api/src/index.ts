import express from "express";
import dotenv from "dotenv";
import tokenRoutes from "./routes/token";
import priceRoutes from "./routes/price";
import cors from "cors";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

app.use("/api", tokenRoutes);
app.use("/api", priceRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
