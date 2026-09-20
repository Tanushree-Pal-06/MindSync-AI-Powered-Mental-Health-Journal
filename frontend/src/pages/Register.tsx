import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        toast.success("Account Created! 🎉", {
          description: `Welcome to MindSync, ${name} 💜`,
        });

        // Give the user a moment to see the toast
        setTimeout(() => {
          navigate("/login");
        }, 1200);
      } else {
        toast.error("Registration Failed", {
          description: data.message || "Couldn't create your account.",
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
        <h1 className="text-2xl font-bold mb-6">Create Account</h1>

        <input
          type="text"
          placeholder="Name"
          className="w-full mb-4 p-3 rounded bg-zinc-800"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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
          onClick={handleRegister}
          className="w-full bg-purple-600 py-3 rounded hover:bg-purple-700 transition"
        >
          Register
        </button>

        <p className="mt-4 text-sm text-center text-muted-foreground">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-primary cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;