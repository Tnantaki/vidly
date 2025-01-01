import { User } from "../../../models/user";
import authorize from "../../../middleware/authorize";
import mongoose from "mongoose";

describe('auth middleware', () => {
  it('should return a valid token', () => {
    const user = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };
    const token = new User(user).generateAuthToken()
    const req = {
      header: (str) => token
    }
    const res = {}
    const next = () => {return}
    authorize(req, res, next)
    expect(req.user).toMatchObject(user)
  })
})