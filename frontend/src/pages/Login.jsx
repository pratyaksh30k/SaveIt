import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const set = (key) => (event) =>
    setForm((form) => ({ ...form, [key]: event.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password)
      return setError("Please fill all fields");
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      console.log(data);
      login(data.token, data.user);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);

      if (err.response) {
        switch (err.response.status) {
          case 400:
            setError("Please enter valid credentials");
            break;

          case 401:
            setError("Invalid email or password");
            break;

          case 403:
            setError("Please verify your email before logging in");
            break;

          case 404:
            setError("User not found");
            break;

          case 500:
            setError("Server error. Please try again later");
            break;

          default:
            setError(err.response.data?.message || "Something went wrong");
        }
      } else if (err.request) {
        setError("Unable to connect to server");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 gap-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
        <div className="mb-8">
          <h1 className="font-heading mb-5 text-5xl text-slate-900 font-bold">
            SaveIt
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Welcome back. Sign in to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-slate-600 mb-2">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={set("email")}
              placeholder="you@example.com"
              className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm text-slate-600">Password</label>
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="cursor-pointer text-sm text-amber-500 hover:text-amber-600"
              >
                Forgot?
              </button>
            </div>
            <input
              type="password"
              value={form.password}
              onChange={set("password")}
              placeholder="••••••••"
              className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition cursor-pointer"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/oauth-callback")}
            className="w-full h-12 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <GoogleIcon /> Continue with Google
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-8">
          No account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-slate-900 font-medium cursor-pointer"
          >
            Create one
          </span>
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
