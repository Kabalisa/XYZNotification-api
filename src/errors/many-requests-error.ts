import { CustomError } from "./custom-error";

export class ManyRequestsError extends CustomError {
  statusCode = 429;

  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, ManyRequestsError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
