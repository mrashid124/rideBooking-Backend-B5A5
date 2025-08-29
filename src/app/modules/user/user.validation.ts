import z from "zod";
import { Role } from "./user.interface";
// import { Role } from "./user.interface";

export const createUserZodSchema = z.object({
  name: z
    // .string({ error: "Name must be string" })
        .string({ invalid_type_error: "Name must be string." })
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(50, { message: "Name cannot exceed 50 characters." }),
  email: z
    // .string({ error: "Email must be string" })
        .string({ invalid_type_error: "Email must be string" })
    .email({ message: "Invalid email address format." })
    .min(5, { message: "Email must be at least 5 characters long." })
    .max(100, { message: "Email cannot exceed 100 characters." }),
  password: z
    // .string({ error: "Password must be string" })
       .string({ invalid_type_error: "Password must be string" })
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/^(?=.*[A-Z])/, {
      message: "Password must contain at least 1 uppercase letter.",
    })
    .regex(/^(?=.*[!@#$%^&*])/, {
      message: "Password must contain at least 1 special character.",
    })
    .regex(/^(?=.*\d)/, {
      message: "Password must contain at least 1 number.",
    }),

  phone: z
    .string({ invalid_type_error: "Phone number must be string" })
    .regex(/^(?:\+880|0)?1[3-9][0-9]{8}$/, {
      message:
        "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    }),

  // role: z.enum(Object.values(Role).filter((role) => role !== "ADMIN") as [string]).optional(),

  role: z.enum([Role.RIDER, Role.DRIVER], {
    required_error: "Role is required",
    invalid_type_error: "Role must be either rider or driver",
  }),

});

export const updateUserZodSchema = z.object({
  name: z
    // .string({ error: "Name must be string" })
    .string({ invalid_type_error: "Name must be string." })
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(50, { message: "Name cannot exceed 50 characters." })
    .optional(),
  email: z
    // .string({ error: "Email must be string" })
    .string({ invalid_type_error: "Email must be string" })
    .email({ message: "Invalid email address format." })
    .min(5, { message: "Email must be at least 5 characters long." })
    .max(100, { message: "Email cannot exceed 100 characters." })
    .optional(),
  password: z
    // .string({ error: "Password must be string" })
        .string({ invalid_type_error: "Password must be string" })
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/^(?=.*[A-Z])/, {
      message: "Password must contain at least 1 uppercase letter.",
    })
    .regex(/^(?=.*[!@#$%^&*])/, {
      message: "Password must contain at least 1 special character.",
    })
    .regex(/^(?=.*\d)/, {
      message: "Password must contain at least 1 number.",
    })
    .optional(),

  role: z.enum(Object.values(Role).filter((role) => role !== Role.ADMIN)).optional(),
  isBlocked: z.boolean({ error: "isBlocked must be true or false" }).optional(),
  
  phone: z
    .string({ invalid_type_error: "Phone number must be string" })
    .regex(/^(?:\+880|880)?1[3-9][0-9]{8}$/, {
      message:
        "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
    .optional(),
  isBlocked: z
    .boolean({ invalid_type_error: "isBlocked must be true or false" })
    .optional(),
  isApproved: z
    .boolean({ invalid_type_error: "isApproved must be true or false" })
    .optional(),
  isAvailable: z
    .boolean({ invalid_type_error: "isAvailable must be true or false" })
    .optional(),
});
