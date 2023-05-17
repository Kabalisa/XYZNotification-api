import mongoose from "mongoose";

import { Password } from "../services/password";

interface UserAttrs {
  name: string;
  phoneNumber: number;
  email: string;
  password: string;
  requestsPerSecond?: number;
}

export interface UserDoc extends mongoose.Document {
  name: string;
  phoneNumber: number;
  email: string;
  password: string;
  requestsPerSecond: number;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    requestsPerSecond: {
      type: Number,
      required: true,
      default: 5,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

UserSchema.pre("save", async function(done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }

  done();
});

UserSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>("User", UserSchema);

export { User };
