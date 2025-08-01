// import { NextFunction, Request, Response } from "express";
import { Request, Response } from "express";
import { User } from "./user.model";

import httpStatus from "http-status-codes";
// import catchAsync from "../../utils/catchAsync";
// import sendResponse from "../../utils/sendResponse";
// import { UserService } from "./user.service";

const createUser = async (req: Request, res: Response) => {

    try {
        const { name, email, phone, password, role} = req.body;
        const user = await User.create({
            name,
            email,
            phone,
            password,
            role
        })
        res.status(httpStatus.CREATED).json({
        message: "User Created Successfully",
        user
        })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        console.log(err);
        res.status(httpStatus.BAD_REQUEST).json({
            message: `SOMETHING WENT WRONG !! ${err.message}`,
            err
        })
    }

}







// const createUser = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         throw new Error("Fake eror")
//         throw new AppError(httpStatus.BAD_REQUEST, "fake error")

//         createUserFunction(req, res)

//     } catch (err: any) {
//         console.log(err);
//         next(err)
//     }
// }

// const createUser = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const result = await UserService.createUser(req.body);

//     sendResponse(res, {
//       statusCode: httpStatus.CREATED,
//       success: true,
//       message: "User Created Successfully!",
//       data: result,
//     });
//   }
// );





export const UserController = { createUser };
