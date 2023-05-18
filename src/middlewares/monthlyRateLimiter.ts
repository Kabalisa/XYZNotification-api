import { Request, Response, NextFunction } from "express";
import { createClient } from "redis";
import { BadRequestError } from "../errors";

const redisClient = createClient();

redisClient.on("error", (err) => {
  throw new BadRequestError("connection to redis failed");
});

export const monthlyRateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await redisClient.connect();
  } catch (error) {
    throw new BadRequestError("connection to redis failed");
  }

  const maxRequestsPerMonth = 50000;
  const currentMonth = new Date().toISOString().slice(0, 7);
  const key = `${req.currentUser?.phoneNumber}:${currentMonth}`;

  const record = await redisClient.get(key);

  if (record) {
    if (Number(record) < maxRequestsPerMonth) {
      redisClient.incr(key);
      next();
      redisClient.quit();
    } else {
      redisClient.quit();
      return res
        .status(429)
        .send("you have exhuasted your monthly requests. try again next month");
    }
  } else {
    redisClient.set(key, 0);
    next();
    redisClient.quit();
  }
};
