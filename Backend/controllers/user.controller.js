import User from "../models/user.model.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { ApiError} from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}


const register = asyncHandler(async (req, res) => {
    const { firstname,lastname, email, password } = req.body;
 
    if (!firstname || !lastname || !email || !password) {
        return res.status(400).json({ message: "Please fill all fields" });
    }

    try {
        const user = await User.create({firstname,lastname, email, password });
        res.status(201).json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Please fill all fields" });
    }

    try {
        const user = await User.findOne({ email });

        const isPasswordValid = await user.isPasswordCorrect(password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
 
      // Generate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    };
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser, accessToken, refreshToken },
                "USER_LOGGED_IN_SUCCESSFULLY"
            )
        );

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



// const uploadToken = asyncHandler(async (req, res) => {
//     const { token } = req.body;
//     const user = req.user;

//     if (!token) {
//         return res.status(400).json({ message: "Please provide a token" });
//     }

//     try {
//         user.uploadedTokens.push(token);
//         await user.save({ validateBeforeSave: false });

//         res.status(200).json({ user });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });




export { register, login }