import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { login } from "../redux/slice/userSlice.ts";
import { useAppDispatch } from "../redux/store.ts";
import { toast } from "react-toastify";

export default function Login() {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ username: username, password: password }))
      .unwrap()
      .then(() => {
        navigate("/");
      })
      .catch(() => {
        toast.error("Login failed. Please check your credentials.");
      });
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50">
      <div className="card w-full max-w-sm bg-white shadow-xl">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center text-pink-600">
            🌷 Flower Shop Login
          </h2>
          <form onSubmit={handleLogin} className="flex flex-col gap-4 mt-4">
            <input
              type="text"
              placeholder="Username"
              className="input input-bordered"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="input input-bordered"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="btn btn-primary bg-pink-500 border-none hover:bg-pink-600"
            >
              Login
            </button>
          </form>
          <p className="text-sm mt-4 text-center">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-pink-600 font-medium hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
