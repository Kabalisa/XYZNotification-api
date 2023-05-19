import { Request, Response, NextFunction } from "express";
import { createClient } from "redis";
import { BadRequestError } from "../errors";

export const redisClient = createClient();

redisClient.on("error", (err) => {
  throw new BadRequestError("connection to redis failed");
});

export const windowRateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await redisClient.connect();
  } catch (error) {
    throw new BadRequestError("connection to redis failed");
  }

  const maxRequestsPerSecond = req.currentUser?.requestsPerSecond!;
  const key = `${req.currentUser?.phoneNumber}`;
  const record = await redisClient.get(key);

  if (record) {
    if (Number(record) > 0) {
      redisClient.decr(key);
      next();
      redisClient.quit();
    } else {
      redisClient.quit();
      return res
        .status(429)
        .send("You have sent too many request. wait for a moment");
    }
  } else {
    redisClient.set(key, maxRequestsPerSecond - 1);
    redisClient.expire(key, 1);
    next();
    redisClient.quit();
  }
};
