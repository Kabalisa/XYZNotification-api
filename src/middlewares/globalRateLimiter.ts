import { Request, Response, NextFunction } from "express";
import { createClient } from "redis";
import { createClient as testCreateClient } from "redis-mock";
import { ManyRequestsError, BadRequestError } from "../errors";

const redisClient =
  process.env.NODE_ENV === "test" ? testCreateClient() : createClient();

redisClient.on("error", (err) => {
  throw new BadRequestError("connection to redis failed");
});

export const globalRateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (process.env.NODE_ENV !== "test") {
    try {
      await redisClient.connect();
    } catch (error) {
      throw new BadRequestError("connection to redis failed");
    }
  }

  try {
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
  } catch (error: any) {
    redisClient.quit();
    throw new BadRequestError(error.name);
  } finally {
    redisClient.quit();
  }
};
