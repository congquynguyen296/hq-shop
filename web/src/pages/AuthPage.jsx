import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const { login, register, error, loading, user } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    let success = false;

    if (mode === "login") {
      success = await login(form.email, form.password);
    } else {
      success = await register({
        email: form.email,
        password: form.password,
        firstName: form.firstName || "User",
        lastName: form.lastName || "Guest",
      });
    }

    if (success) {
      setTimeout(() => {
        navigate("/");
      }, 1500);
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-32 mb-5 p-6 border border-gray-200 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4 text-center">
        {mode === "login" ? "Đăng nhập" : "Đăng ký"}
      </h2>

      {user && (
        <div className="mb-2 text-green-600 text-sm">
          Đã đăng nhập: {user.email}
        </div>
      )}
      {error && <div className="mb-2 text-red-600 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-3">
        {mode === "register" && (
          <div className="flex gap-2">
            <input
              placeholder="Họ"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            />
            <input
              placeholder="Tên"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
        )}
        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
        />
        <input
          placeholder="Mật khẩu"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
        />
        <button
          disabled={loading}
          type="submit"
          className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium rounded-md transition-colors"
        >
          {loading
            ? "Đang xử lý..."
            : mode === "login"
            ? "Đăng nhập"
            : "Đăng ký"}
        </button>
      </form>

      <div className="mt-3 text-sm text-center">
        {mode === "login" ? (
          <span>
            Chưa có tài khoản?{" "}
            <button
              type="button"
              onClick={() => setMode("register")}
              className="text-purple-600 hover:underline"
            >
              Đăng ký
            </button>
          </span>
        ) : (
          <span>
            Đã có tài khoản?{" "}
            <button
              type="button"
              onClick={() => setMode("login")}
              className="text-purple-600 hover:underline"
            >
              Đăng nhập
            </button>
          </span>
        )}
      </div>
    </div>
  );
}
