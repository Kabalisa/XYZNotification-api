import { Request, Response, NextFunction } from "express";
import { createClient } from "redis";
import { mockRequest, mockResponse } from "jest-mock-req-res";
import { windowRateLimiter } from "../middlewares";

describe("windowRateLimiter middleware", () => {
  let redisClient: any;
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeAll(async () => {
    redisClient = createClient();
    await redisClient.connect();
    req = mockRequest({
      currentUser: { phoneNumber: "0788112233" },
    });
    res = mockResponse();
    next = jest.fn();
  });

  afterAll(() => {
    redisClient.quit();
  });

  it("windowRateLimiter should allow request if token is available", async () => {
    await redisClient.set("0788112233", 1);

    await windowRateLimiter(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it("monthlyRateLimiter should reject the request if token is not available", async () => {
    await redisClient.set("0788112233", 0);

    await windowRateLimiter(req, res, next);

    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.send).toHaveBeenCalledWith(
      "You have sent too many request. wait for a moment"
    );
  });
});
