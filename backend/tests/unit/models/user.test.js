import { User } from "../../../models/user.js";
import {jest} from '@jest/globals';
import jwt from "jsonwebtoken";
import env from 'dotenv'
env.config()

// jest.useFakeTimers();  // For ES modules setting

describe("user.generateAuth", () => {
  it("should return a valid JWT", () => {
    const payload = {
      isAdmin: true
    }
    const user = new User(payload);
    const token = user.generateAuthToken()
    const decoded = jwt.verify(token, process.env.API_PRIVATE_KEY)
    payload._id = user._id.toString()
    expect(decoded).toMatchObject(payload)
  });
});
