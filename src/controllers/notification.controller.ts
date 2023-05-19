import { Request, Response } from "express";
import { User } from "../models/user";
import { BadRequestError } from "../errors";

class NotificationController {
  static async sendNotification(req: Request, res: Response) {
    return res.send("success");
  }

  static async buyRequests(req: Request, res: Response) {
    const { phoneNumber } = req.currentUser!;
    const { amount } = req.body;

    const existingUser = await User.findOne({ phoneNumber });

    if (!existingUser) {
      throw new BadRequestError("user do not exist");
    }

    const newRequestsPerSecond =
      Number(existingUser.requestsPerSecond) + Number(amount);
    await User.updateOne({ phoneNumber }, { requestsPerSecond: newRequestsPerSecond });

    return res.send("requests bought successfully");
  }
}

export default NotificationController;
