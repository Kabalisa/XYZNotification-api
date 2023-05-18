import { Request, Response, NextFunction } from "express";
import { redisClient } from "../index";
import { ManyRequestsError } from "../errors";

// rate limiter for requests per second for all clients on the system.
export const globalRateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const systemMaxRequestsPerSecond = 5000;
  const key = "system:rate-limit";

  const record = await redisClient.get(key);

  if (record) {
    if (Number(record) < systemMaxRequestsPerSecond) {
      redisClient.incr(key);
      next();
    } else {
      throw new ManyRequestsError(
        "the system is receiving many requests. try again later"
      );
    }
  } else {
    redisClient.set(key, 1);
    redisClient.expire(key, 1);
    next();
  }
};
