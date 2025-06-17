import express, { Request, Response } from 'express';
import { publicRouter } from './route/public';
import cookieParser from "cookie-parser";
import cors from "cors";
import { apiRouter } from './route/api';
import path from 'path';
import { errorMiddleware } from './middleware/error-middlewa';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static(path.join(__dirname, "./uploads")));
app.use("/api", publicRouter);
app.use("/api", apiRouter);
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
