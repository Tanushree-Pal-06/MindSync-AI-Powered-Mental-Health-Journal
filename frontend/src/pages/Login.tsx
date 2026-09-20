import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        toast.success("Login Successful!", {
          description: `Welcome back, ${data.name} 💜`,
        });

        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("name", data.name);

        navigate("/diary");
      } else {
        toast.error("Login Failed", {
          description: data.message || "Invalid email or password.",
        });
      }
    } catch (error) {
      console.error(error);

      toast.error("Server Error", {
        description: "Couldn't connect to the backend.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <div className="bg-zinc-900 p-8 rounded-xl w-96">
        <h1 className="text-2xl font-bold mb-6">Login</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 rounded bg-zinc-800"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-3 rounded bg-zinc-800"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-purple-600 py-3 rounded hover:bg-purple-700 transition"
        >
          Login
        </button>

        <p className="mt-4 text-sm text-center text-muted-foreground">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-primary cursor-pointer hover:underline"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;