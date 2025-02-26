import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [focusedFields, setFocusedFields] = useState({
    email: false,
    password: false,
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/admin/login", 
        { email, password }, 
        { withCredentials: true } 
      );
      
      
      
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      toast.success("Login Successful!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setTimeout(() => {
        navigate("/dashboard"); 
      }, 1500);

      
      setEmail("");
      setPassword("");
    } 
    
   catch (err) {
  if (err.response && err.response.data) {
    const { message } = err.response.data;

    
    if (message.toLowerCase().includes("invalid email format")) {
      setError("Invalid email format");
    } else if (message.toLowerCase().includes("email is not registered")) {
      setError("Email is not registered");
    } else if (message.toLowerCase().includes("incorrect password")) {
      setError("Incorrect password");
    } else {
      setError("Something went wrong. Please try again.");
    }
  } else {
    setError("Something went wrong. Please try again.");
  }
}
  }


  const handleFocus = (field) => {
    setFocusedFields((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field, value) => {
    setFocusedFields((prev) => ({ ...prev, [field]: value !== "" }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="bg-[#63278D] p-8 rounded-lg shadow-lg w-[450px] text-white">
        <h2 className="text-2xl font-bold text-center">Welcome Back</h2>

        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

        <form onSubmit={handleLogin} className="mt-4">
          <div className="relative w-full mb-4">
            <input
              type="email"
              id="email"
              className="peer w-full p-2 bg-transparent border-b-2 border-gray-300 text-white focus:border-white focus:outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
              required
              onFocus={() => handleFocus("email")}
              onBlur={(e) => handleBlur("email", e.target.value)}
              autoComplete="off"
            />
            <label
              htmlFor="email"
              className={`absolute left-2 transition-all ${
                focusedFields.email
                  ? "top-[-1rem] text-sm text-white"
                  : "top-1 text-gray-300 text-lg"
              }`}
            >
              Email Address
            </label>
          </div>

          <div className="relative w-full mb-4">
            <input
              type="password"
              id="password"
              className="peer w-full p-2 bg-transparent border-b-2 border-gray-300 text-white focus:border-white focus:outline-none transition-all "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              onFocus={() => handleFocus("password")}
              onBlur={(e) => handleBlur("password", e.target.value)}
              autoComplete="new-password"
            />
            <label
              htmlFor="password"
              className={`absolute left-2 transition-all ${
                focusedFields.password
                  ? "top-[-1rem] text-sm text-white "
                  : "top-1 text-gray-300 text-lg "
              }`}
            >
              Password
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-[#8C1DE3] p-2 rounded text-white font-bold mt-6 disabled:opacity-50 disabled:cursor-not-allowed transition-transform transform hover:scale-105"
          >
            Sign In
          </button>
        </form>

        <p className="text-center mt-4">
          Not Registered?{" "}
          <Link to="/register" className="text-white hover:underline">
            Register here
          </Link>
        </p>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Login;