import User, { IUser } from "../models/User";
import { generateToken } from "../helper/token";

export interface AuthPayload {
  userId: string;
  email: string;
  role: string;
}

export interface PublicUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
}

function toPublicUser(user: IUser): PublicUser {
  return {
    id: (user as any)._id.toString(),
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    address: user.address,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
  };
}

export async function registerUser(input: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
}): Promise<{ user: PublicUser; token: string }>
{
  const existingUser = await User.findOne({ email: input.email });
  if (existingUser) {
    throw new Error("EMAIL_IN_USE");
  }

  const user = new User({
    email: input.email,
    password: input.password,
    firstName: input.firstName,
    lastName: input.lastName,
    phone: input.phone,
    address: input.address,
  });
  await user.save();

  const token = generateToken({
    userId: (user as any)._id.toString(),
    email: user.email,
    role: user.role,
  });

  return { user: toPublicUser(user), token };
}

export async function loginUser(input: {
  email: string;
  password: string;
}): Promise<{ user: PublicUser; token: string }>
{
  const user = await User.findOne({ email: input.email }).select("+password");
  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }
  if (!user.isActive) {
    throw new Error("USER_INACTIVE");
  }

  const isPasswordValid = await (user as any).comparePassword(input.password);
  if (!isPasswordValid) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const token = generateToken({
    userId: (user as any)._id.toString(),
    email: user.email,
    role: user.role,
  });

  return { user: toPublicUser(user), token };
}

export async function getProfileById(userId: string): Promise<PublicUser | null> {
  const user = await User.findById(userId);
  return user ? toPublicUser(user) : null;
}

// Stateless JWT logout. If you add token blacklist, implement here.
export async function logoutUser(): Promise<boolean> {
  return true;
}


