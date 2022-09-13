import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import apiRoutes from "./src/controllers/api.js";
import redisClient from "./src/configs/redis.js";

const app = express();
const port = 4000;

await redisClient.connect();

app.use(
  cors({
    origin: "*",
  })
);

//routes
apiRoutes(app);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
