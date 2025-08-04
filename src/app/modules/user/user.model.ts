
import { model, Schema } from "mongoose";
import bcrypt from 'bcrypt';

export type UserRole = 'admin' | 'rider' | 'driver';

export interface IUser {
    _id: string;
    name: string;
    email: string;
    phone: string;
    password: string;
    role: UserRole;
    isBlocked?: boolean;
    isApproved?: boolean; // for drivers
}

const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String, unique: true },
        password: { type: String, required: true, select: false },
        role: { type: String, enum: ['admin', 'rider', 'driver'], required: true },
        isBlocked: { type: Boolean, default: false },
        isApproved: { type: Boolean, default: false }, // for driver only
    },
    { timestamps: true }
);

// Hash password 
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

export const User = model<IUser>('User', userSchema);






// ********
// import { model, Schema } from "mongoose";
// import { IUser, Role } from "./user.interface";



// const userSchema = new Schema<IUser>(
//   {
//     name: { type: String, required: true, trim: true },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },
//     password: { type: String, required: true },
//     role: {
//       type: String,
//       enum: Object.values(Role),
//     //   default: Role.RIDER,
//       default: Role.RIDER,
//     },
//     phone: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//     },

//     isBlocked: {
//       type: Boolean,
//       default: false,
//     },
//     isApproved: {
//       type: Boolean,
//       default: false,
//     },
//     isAvailable: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   { timestamps: true, versionKey: false }
// );

// export const User = model<IUser>("User", userSchema);
