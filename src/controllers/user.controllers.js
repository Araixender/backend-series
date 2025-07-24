import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/users.models.js";

const registerUser = asyncHandler(async (req, res) => {
  // TODO: Get user details from users.

  // TODO: Handle file(s)

  // TODO: Validate - Not empty.

  // TODO: Check if user already exist or not. (username, password)

  // TODO: check for images, checks for avatar

  // TODO: upload them to cloudinary, avatar,

  // TODO: Create user object - create entry in db.

  // TODO: check for user creation.

  // TODO: return Response.

  const { fullName, email, username, password } = req.body;
  console.log("email: ", email);

  if (
    [fullName, email, username, password].some(
      (fields) => fields?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All Fields Are Required");
  }

  const existedUser = User.findOne({ $or: [{ username }, { email }] });
  // https://youtu.be/7fjOw8ApZ1I?si=wLf2XvDT2urxWWA-&t=32790
  res.status(200).json({ message: "ok" });
});

export { registerUser };
