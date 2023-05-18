import { Request, Response, NextFunction } from "express";
import { createClient } from "redis";
import { mockRequest, mockResponse } from "jest-mock-req-res";
import { monthlyRateLimiter } from "../middlewares";

describe("monthlyRateLimiter middleware", () => {
  let redisClient: any;
  let req: Request;
  let res: Response;
  let next: NextFunction;
  let currentMonth = new Date().toISOString().slice(0, 7);

  beforeAll(async () => {
    redisClient = createClient();
    await redisClient.connect();
    req = mockRequest({
      currentUser: { phoneNumber: "0788112233" },
    });
    res = mockResponse();
    next = jest.fn();
  });

  afterEach((done) => {
    done();
  });

  afterAll(() => {
    redisClient.quit();
  });

  it("monthlyRateLimiter should reject the request if the client reached the limit", async () => {
    await redisClient.set(`0788112233:${currentMonth}`, 50000);

    await monthlyRateLimiter(req, res, next);

    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.send).toHaveBeenCalledWith(
      "you have exhuasted your monthly requests. try again next month"
    );
  });

  it("monthlyRateLimiter should allow request if the client have not reached the limit", async () => {
    await redisClient.set(`0788112233:${currentMonth}`, 1);

    await monthlyRateLimiter(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
