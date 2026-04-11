import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { login, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [token, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      await login(username, password);
      // Wait for useEffect redirect
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data || "Failed to login. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary flex flex-col items-center justify-center p-4">
      <Link to="/" className="absolute top-8 left-8 flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Link>
      
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-border p-8">
        <div className="text-center mb-8">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white mx-auto mb-4 font-bold text-xl">Z</div>
          <h1 className="text-2xl font-semibold tracking-tight mb-2">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Enter your details to sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Username</label>
            <Input 
              type="text" 
              placeholder="e.g. johndoe" 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium leading-none">Password</label>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary">Forgot password?</a>
            </div>
            <Input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          {errorMsg && (
            <div className="p-3 text-sm bg-red-50 text-red-600 rounded-lg border border-red-100">
              {typeof errorMsg === "string" ? errorMsg : "Login failed"}
            </div>
          )}

          <Button type="submit" className="w-full mt-6" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/signup" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
