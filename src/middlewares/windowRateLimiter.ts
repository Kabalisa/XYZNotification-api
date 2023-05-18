import { Request, Response, NextFunction } from "express";
import { createClient } from "redis";
import { createClient as testCreateClient } from "redis-mock";
import { ManyRequestsError, BadRequestError } from "../errors";

const redisClient =
  process.env.NODE_ENV === "test" ? testCreateClient() : createClient();

redisClient.on("error", (err) => {
  throw new BadRequestError("connection to redis failed");
});

export const windowRateLimiter = async (
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
    const maxRequestsPerSecond = 5;
    const key = `${req.currentUser?.phoneNumber}`;

    const record = await redisClient.get(key);

    if (record) {
      if (Number(record) > 0) {
        redisClient.decr(key);
        next();
      } else {
        throw new ManyRequestsError(
          "You have sent too many request. wait for a moment"
        );
      }
    } else {
      redisClient.set(key, maxRequestsPerSecond - 1);
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
