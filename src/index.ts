import mongoose from "mongoose";
import { createClient } from "redis";

import { app } from "./app";

export const redisClient = createClient();

redisClient.on("error", (err) => console.log("Redis Client Error", err));

const start = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }

  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected to mongodb");
  } catch (error) {
    console.error(error);
  }

  try {
    await redisClient.connect();
    console.log("connected to redis");
  } catch (error) {
    console.error(error);
  }

  const PORT = process.env.PORT;
  app.listen(PORT, () => {
    console.log(`app listening on port ${PORT}....`);
  });
};

start();
