import { Request, Response, NextFunction } from "express";
import { redisClient } from "../index";
import { ManyRequestsError } from "../errors";

// rate limiter for requests per month for a certain user.
export const monthlyRateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
};
