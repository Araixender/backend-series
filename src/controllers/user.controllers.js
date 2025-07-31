import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/users.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshAccessToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong, while generating and refresh token"
    );
  }
};

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

  if (
    [fullName, email, username, password].some(
      (fields) => fields?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All Fields Are Required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "username or email already existed");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }
  if (!avatarLocalPath) throw new ApiError(400, "Avatar file is required");

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) throw new ApiError(400, "Avatar file is required");

  const user = await User.create({
    fullName,
    avatar: avatar,
    coverImage: coverImage || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser)
    throw new ApiError(500, "while registering user, something went wrong");

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "user has been registered"));
});

const loginUser = asyncHandler(async (req, res) => {
  // TODO: take data from request body
  // TODO: check if the user existes in to the database
  // TODO: compare password (which should be already done)
  // TODO: create token & refresh token
  // TODO: Save refresh token to the database.
  // TODO: remove password from response.
  // TODO: send object of user
  // TODO: send token as cookie

  const { email, username, password } = req.body;

  if (!username || !email)
    throw new ApiError(400, "username or password is required");

  const user = await User.findOne({
    $or: [{ username, email }],
  });

  if (!user) throw new ApiError(404, "User does not exist");

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) throw new ApiError(401, "invalid user credentials");

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, {
        user: loggedInUser,
        accessToken,
        refreshToken,
        message: "User Logged-In Successfully.",
      })
    );
});

export { registerUser, loginUser };
