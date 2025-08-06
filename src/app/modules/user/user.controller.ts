import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";

import { UserService } from "./user.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserService.createUser(req.body);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User Created Successfully!",
      data: result,
    });
  }
);

const getAllRiders = catchAsync(
  async (_req: Request, res: Response, next: NextFunction) => {
    const result = await UserService.getAllRiders();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All Riders Retrieved Successfully!",
      data: {
        users: result.data,
        meta: result.meta,
      },
    });
  }
);

const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;

    const verifiedToken = req.user;

    const payload = req.body;

    const result = await UserService.updateUser(
      userId,
      payload,
      verifiedToken as JwtPayload
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User Updated Successfully!",
      data: result,
    });
  }
);

const blockedUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const decodedToken = req.user;

    const result = await UserService.blockedUser(
      userId,
      decodedToken as JwtPayload
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User Updated Successfully!",
      data: result,
    });
  }
);

export const UserController = {
  createUser,
  getAllRiders,
  updateUser,
  blockedUser,
};






// import { Request, Response } from "express";
// import { User } from "./user.model";

// import httpStatus from "http-status-codes";


// const createUser = async (req: Request, res: Response) => {

//     try {
//         const { name, email, phone, password, role} = req.body;
//         const user = await User.create({
//             name,
//             email,
//             phone,
//             password,
//             role
//         })
//         res.status(httpStatus.CREATED).json({
//         message: "User Created Successfully",
//         user
//         })
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     } catch (err: any) {
//         console.log(err);
//         res.status(httpStatus.BAD_REQUEST).json({
//             message: `SOMETHING WENT WRONG !! ${err.message}`,
//             err
//         })
//     }

// }

// export const UserController = { createUser };
