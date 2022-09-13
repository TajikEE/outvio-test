import { rateLimiter } from "../middlewares/rate-limiter.js";
import { verifyAuth } from "../middlewares/auth.js";

export default function apiRoutes(app) {
  app.get(
    "/public",
    [rateLimiter((req) => req.ip, process.env.IP_LIMIT_COUNT)],
    async (req, res) => {
      const result = {
        isFree: true,
        message: "Open to the whole wide world",
      };

      res.json(result);
    }
  );

  app.get(
    "/private",
    [
      verifyAuth,
      rateLimiter((req) => req.userId, process.env.TOKEN_LIMIT_COUNT),
    ],
    async (req, res) => {
      const result = {
        isFree: false,
        message: "This seems like a secret!",
      };

      res.json(result);
    }
  );

  app.get(
    "/weighted",
    [
      rateLimiter(
        (req) => req.ip,
        process.env.IP_LIMIT_COUNT,
        process.env.POINTS
      ),
    ],
    async (req, res) => {
      const result = {
        isFree: true,
        message: `This is weighted api request of ${process.env.POINTS} points`,
      };

      res.json(result);
    }
  );
}
