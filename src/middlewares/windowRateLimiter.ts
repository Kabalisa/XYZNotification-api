import { Request, Response, NextFunction } from "express";
import { redisClient } from "../index";
import { ManyRequestsError } from "../errors";

// rate limiter for requests per second for a certain user.
export const windowRateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
};
