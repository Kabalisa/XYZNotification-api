import { Request, Response, NextFunction } from "express";
import { createClient } from "redis-mock";
import { mockRequest, mockResponse } from "jest-mock-req-res";
import mongoose from "mongoose";
import { windowRateLimiter } from "../middlewares";

describe("windowRateLimiter middleware", () => {
  let redisClient: any;
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    redisClient = createClient();
    req = mockRequest({
      currentUser: { phoneNumber: "0788112233" },
    });
    res = mockResponse();
    next = jest.fn();
  });

  afterEach(() => {
    redisClient.quit();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("windowRateLimiter should allow request if token is available", async () => {
    await redisClient.set("0788112233", 1);

    await windowRateLimiter(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
