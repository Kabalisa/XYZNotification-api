import { Request, Response } from "express";

class NotificationController {
  static async sendNotification(req: Request, res: Response) {
    return res.send("success");
  }
}

export default NotificationController;
