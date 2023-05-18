import { Request, Response, NextFunction } from "express";
import { createClient } from "redis";
import { createClient as testCreateClient } from "redis-mock";
import { ManyRequestsError, BadRequestError } from "../errors";

const redisClient =
  process.env.NODE_ENV === "test" ? testCreateClient() : createClient();

redisClient.on("error", (err) => {
  throw new BadRequestError("connection to redis failed");
});

export const monthlyRateLimiter = async (
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
    const maxRequestsPerMonth = 50000;
    const currentMonth = new Date().toISOString().slice(0, 7);
    const key = `${req.currentUser?.phoneNumber}:${currentMonth}`;

    const record = await redisClient.get(key);

    if (record) {
      if (Number(record) < maxRequestsPerMonth) {
        redisClient.incr(key);
        next();
      } else {
        throw new ManyRequestsError(
          "you have exhuasted your monthly requests. try again next month"
        );
      }
    } else {
      redisClient.set(key, 0);
      next();
    }
  } catch (error: any) {
    redisClient.quit();
    throw new BadRequestError(error.name);
  } finally {
    redisClient.quit();
  }
};
