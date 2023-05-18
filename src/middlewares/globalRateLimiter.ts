import { Request, Response, NextFunction } from "express";
import { createClient } from "redis";
import { BadRequestError } from "../errors";

const redisClient = createClient();

redisClient.on("error", (err) => {
  throw new BadRequestError("connection to redis failed");
});

export const globalRateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await redisClient.connect();
  } catch (error) {
    throw new BadRequestError("connection to redis failed");
  }

  const systemMaxRequestsPerSecond = 5000;
  const key = "system:rate-limit";

  const record = await redisClient.get(key);

  if (record) {
    if (Number(record) < systemMaxRequestsPerSecond) {
      redisClient.incr(key);
      next();
      redisClient.quit();
    } else {
      redisClient.quit();
      return res
        .status(429)
        .send("the system is receiving many requests. try again later");
    }
  } else {
    redisClient.set(key, 1);
    redisClient.expire(key, 1);
    next();
    redisClient.quit();
  }
};
