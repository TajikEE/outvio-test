import moment from "moment";
import redisClient from "../configs/redis.js";

export const rateLimiter =
  (identifierFn, limit, points = 1) =>
  async (req, res, next) => {
    try {
      const identifier = identifierFn(req);

      const key = `rate-limit:v1:${identifier}`;

      const result = await redisClient
        .multi()
        .zRangeByScore(
          key,
          0,
          moment().valueOf() - process.env.WINDOW_SIZE_IN_HOURS * 60 * 60 * 1000
        )
        .zRange(key, 0, -1)
        .zAdd(key, [
          { score: moment().valueOf(), value: moment().valueOf().toString() },
        ])
        .expire(key, process.env.WINDOW_SIZE_IN_HOURS * 60 * 60)
        .exec();

      // example result item is [ [], [ '1663064784665' ], 1, true ]
      // The timeStampItem is milliseconds string
      // The added value of 1 means that record is updated in redis, 0 means operation not done
      // The true boolean means it will expire the item after mentioned time period
      const [_, timeStampItem, added] = result;

      // handle case where remaining limit is not enough for weighted points
      // example: points = 3 but user has used 9/10 limit. So 1 more request will exceed 10 already
      const remainingWeightedFraction =
        limit - timeStampItem.length * points < points;

      // The added part makes sure that it only checks for records which are saved to redis,
      // because if too many requests come then redis will return 0 for added which means it is not saved
      if (
        remainingWeightedFraction ||
        timeStampItem.length * points + added > limit
      ) {
        const resetTime = moment(parseInt(result[1][1]))
          .add(process.env.WINDOW_SIZE_IN_HOURS, "hours")
          .format("DD/MM/YYYY hh:mm:ss");

        return res
          .status(429)
          .send(
            `You have exceeded the ${process.env.IP_LIMIT_COUNT} requests in ${process.env.WINDOW_SIZE_IN_HOURS} hr limit!. You can try again at ${resetTime}`
          );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
