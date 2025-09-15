import { Request, Response } from "express";
import { getProfileById, loginUser, logoutUser, registerUser } from "../services/auth.service";

const JWT_SECRET: string = "A7f$kP2x!dQ9mL0vR4s#tW8y";
const JWT_EXPIRES_IN: string = "1d";

// Register
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, phone, address } = req.body;
    const { user, token } = await registerUser({
      email,
      password,
      firstName,
      lastName,
      phone,
      address,
    });
    res.status(201).json({
      success: true,
      message: "Đăng ký thành công",
      data: { user, token },
    });
  } catch (error: any) {
    if (error?.message === "EMAIL_IN_USE") {
      return res.status(400).json({ success: false, message: "Email đã được sử dụng" });
    }
    console.error("Register error:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// Login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginUser({ email, password });
    res.json({
      success: true,
      message: "Đăng nhập thành công",
      data: { user, token },
    });
  } catch (error: any) {
    if (error?.message === "USER_INACTIVE") {
      return res.status(401).json({ success: false, message: "Tài khoản đã bị khóa" });
    }
    if (error?.message === "INVALID_CREDENTIALS") {
      return res.status(401).json({ success: false, message: "Email hoặc mật khẩu không đúng" });
    }
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// Get current user profile
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Không có quyền truy cập" });
    }
    const user = await getProfileById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    await logoutUser();
    res.json({ success: true, message: "Đăng xuất thành công" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};
