import { Request, Response } from "express";
import { User } from "../models/user";
import { BadRequestError } from "../errors";
import { Token } from "../services/token";
import { Password } from "../services/password";

class AuthController {
  static async signin(req: Request, res: Response) {
    const { phoneNumber, password } = req.body;

    const existingUser = await User.findOne({ phoneNumber });

    if (!existingUser) {
      throw new BadRequestError("Invalid credentials. try again");
    }

    const passwordMatch = await Password.compare(
      password,
      existingUser.password
    );

    if (!passwordMatch) {
      throw new BadRequestError("Invalid credentials. try again");
    }

    const jwt = Token.jwtSign(
      existingUser.id,
      existingUser.name,
      existingUser.phoneNumber,
      existingUser.email,
      existingUser.requestsPerSecond
    );

    return res.send({ user: existingUser, jwt });
  }

  static async signup(req: Request, res: Response) {
    const { name, phoneNumber, email, password } = req.body;

    const existingUser = await User.findOne({ phoneNumber });

    if (existingUser) {
      throw new BadRequestError("user already exists");
    }

    const user = User.build({ name, phoneNumber, email, password });

    await user.save();

    const jwt = Token.jwtSign(
      user.id,
      user.name,
      user.phoneNumber,
      user.email,
      user.requestsPerSecond
    );

    return res.send({ user, jwt });
  }

  static async currentUser(req: Request, res: Response) {
    return res.send({ currentUser: req.currentUser || null });
  }
}

export default AuthController;
