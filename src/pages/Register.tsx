import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../redux/store.ts";
import { register } from "../redux/slice/userSlice.ts";
import { toast } from "react-toastify";

export default function Register() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      register({ username: username, password: password, fullName: name })
    )
      .unwrap()
      .then(() => {
        toast("Create account successfully");
        navigate("/login");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50">
      <div className="card w-full max-w-sm bg-white shadow-xl">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center text-pink-600">
            🌸 Flower Shop Register
          </h2>
          <form onSubmit={handleRegister} className="flex flex-col gap-4 mt-4">
            <input
              type="text"
              placeholder="Full Name"
              className="input input-bordered"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Username"
              className="input input-bordered"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
              Register
            </button>
          </form>
          <p className="text-sm mt-4 text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-pink-600 font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
