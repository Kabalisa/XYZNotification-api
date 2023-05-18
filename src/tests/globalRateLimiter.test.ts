import { Request, Response, NextFunction } from "express";
import { createClient } from "redis";
import { mockRequest, mockResponse } from "jest-mock-req-res";
import { globalRateLimiter } from "../middlewares";

describe("globalRateLimiter middleware", () => {
  let redisClient: any;
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeAll(async () => {
    redisClient = createClient();
    await redisClient.connect();
    req = mockRequest();
    res = mockResponse();
    next = jest.fn();
  });

  afterAll(() => {
    redisClient.quit();
  });

  it("monthlyRateLimiter should reject the request if the system limit per second is reached", async () => {
    await redisClient.set("system:rate-limit", 5000);

    await globalRateLimiter(req, res, next);

    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.send).toHaveBeenCalledWith(
      "the system is receiving many requests. try again later"
    );
  });

  it("globalRateLimiter should allow request if the system limit per second is not reached", async () => {
    await redisClient.set("system:rate-limit", 1);

    await globalRateLimiter(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
