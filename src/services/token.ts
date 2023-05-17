import jwt from "jsonwebtoken";

export class Token {
  static jwtSign(
    id: any,
    name: string,
    phoneNumber: number,
    email: string,
    requestsPerSecond: number
  ) {
    const userJwt = jwt.sign(
      {
        id: id,
        name: name,
        phoneNumber: phoneNumber,
        email,
        requestsPerSecond,
      },
      process.env.JWT_KEY!
    );

    return userJwt;
  }
}
