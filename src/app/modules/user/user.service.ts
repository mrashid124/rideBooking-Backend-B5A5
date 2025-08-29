import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/appError";
import { ActiveStatus, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import mongoose from "mongoose";
// 





const createUser = async (payload: IUser) => {
  const { email, password, ...rest } = payload;

  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already exist!");
  }

  const hashedPassword = await bcryptjs.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const user = await User.create({
    email,
    password: hashedPassword,
    ...rest,
  });
  return user;

    // Role checking
    if (!allowedRolesForCreation.includes(role)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Invalid Role, You can't add as a ADMIN Role"
    );
  }

  if (role !== Role.ADMIN) {
    if (role === Role.RIDER) {
      const hashedPassword = await bcryptjs.hash(
        password as string,
        Number(envVars.BCRYPT_SALT_ROUND)
      );

      const user = await User.create({
        email,
        role,
        password: hashedPassword,
        ...rest,
      });
      const { password: returnPassword, ...restData } = user.toObject();
      return restData;
    } else if (role === Role.DRIVER) {
      const hashedPassword = await bcryptjs.hash(
        password as string,
        Number(envVars.BCRYPT_SALT_ROUND)
      );

      const user = await User.create({
        email,
        password: hashedPassword,
        role,
        ...rest,
      });
      await Driver.create({
        user: user._id,
      });
      const { password: returnPassword, ...restData } = user.toObject();
      return restData;
    }
  }

};

// const getAllRiders = async () => {
//   const users = await User.find({ role: Role.RIDER });
//   const totalUsers = await User.countDocuments({ role: Role.RIDER });
//   return {
//     data: users,
//     meta: {
//       total: totalUsers,
//     },
//   };
// };

const getAllRiders = async (
  searchTerm?: string,
  page: number = 1,
  limit: number = 5,
  status?: string
) => {
  const query: any = { role: Role.RIDER };
  const skip = (page - 1) * limit;
  // 🔹 status filter logic

  console.log(status);
  if (status) {
    if (status === ActiveStatus.ACTIVE) query.isActive = ActiveStatus.ACTIVE;
    else if (status === ActiveStatus.BLOCKED)
      query.isActive = ActiveStatus.BLOCKED;
  }

  if (searchTerm) {
    query.$or = [
      { name: { $regex: searchTerm, $options: "i" } },
      { email: { $regex: searchTerm, $options: "i" } },
      { phone: { $regex: searchTerm, $options: "i" } },
    ];
  }

  const riders = await User.find(query).skip(skip).limit(limit);
  const totalRiders = await User.countDocuments({ role: Role.RIDER });
  return {
    data: riders,
    meta: {
      total: totalRiders,
    },
  };
};

const getAllDrivers = async (
  searchTerm?: string,
  page: number = 1,
  limit: number = 5
) => {
  const query: any = { role: Role.DRIVER };
  const skip = (page - 1) * limit;

  if (searchTerm) {
    query.$or = [
      { name: { $regex: searchTerm, $options: "i" } },
      { email: { $regex: searchTerm, $options: "i" } },
      { phone: { $regex: searchTerm, $options: "i" } },
    ];
  }

  const drivers = await User.find(query).skip(skip).limit(limit);
  const totalDrivers = await User.countDocuments({ role: Role.DRIVER });
  return {
    data: drivers,
    meta: {
      total: totalDrivers,
    },
  };
};


const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  const isExistUser = await User.findById(userId);
  if (!isExistUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }


  const isSelf = decodedToken.userId === userId;

  if (!isSelf) {
    if (decodedToken.role === Role.RIDER || decodedToken.role === Role.DRIVER) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are not authorized to update!"
      );
    }

    if (decodedToken.role === Role.ADMIN && isExistUser.role === Role.ADMIN) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Admin cannot update other Admin"
      );
    }
  }


  if (payload.role) {
    if (decodedToken.role === Role.RIDER || decodedToken.role === Role.DRIVER) {
      if (payload.role === Role.ADMIN) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          "You are not authorized to change!"
        );
      }
    }
  }

  // if (payload.password) {
  //   payload.password = await bcryptjs.hash(
  //     payload.password,
  //     envVars.BCRYPT_SALT_ROUND
  //   );
  // }




  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return newUpdatedUser;
};

// const blockedUser = async (userId: string, decodedToken: JwtPayload) => {
//   const isExistUser = await User.findById(userId);
//   if (!isExistUser) {
//     throw new AppError(httpStatus.NOT_FOUND, "User not found!");
//   }

//   if (decodedToken.role === Role.RIDER || decodedToken.role === Role.DRIVER) {
//     throw new AppError(
//       httpStatus.FORBIDDEN,
//       "You are not authorized."
//     );
//   }

//   if (isExistUser.isActive !== ActiveStatus.ACTIVE) {
//     isExistUser.isActive = ActiveStatus.ACTIVE;
//     await isExistUser.save();
//     return isExistUser;
//   }

//   isExistUser.isActive = ActiveStatus.BLOCKED;
//   await isExistUser.save();
//   return isExistUser;
// };

const blockedUser = async (
  userId: string,
  decodedToken: JwtPayload,
  status: string
) => {

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Invalid MongoDB ObjectID. Please provide a valid id"
    );
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User doesn't exist!");
  }


  if (decodedToken.role !== Role.ADMIN) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to perform this action."
    );
  }


  if (user.isActive === status) {
    return user;
  }


  user.isActive = status as ActiveStatus;
  await user.save();

  return user;
};

const getMe = async (userId: string) => {
  const user = await User.findById(userId).select("-password");
  return {
    data: user,
  };
};


export const UserService = {
  createUser,
  getAllRiders,
  updateUser,
  blockedUser,
  getMe,
  getAllDrivers,
};
