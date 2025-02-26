import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ReactTyped } from "react-typed";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState(sessionStorage.getItem("name") || "");
  const [email, setEmail] = useState(sessionStorage.getItem("email") || "");
  const [password, setPassword] = useState(
    sessionStorage.getItem("password") || ""
  );
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedFields, setFocusedFields] = useState({
    name: false,
    email: false,
    password: false,
    ConfirmPassword: false,
  });

  useEffect(() => {
    sessionStorage.setItem("name", name);
    sessionStorage.setItem("email", email);
    sessionStorage.setItem("password", password);
  }, [name, email, password]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    if (!/^[a-z0-9._%+-]+@gmail\.com$/.test(email)) {
      setMessage("Email must be a valid @gmail.com address.");
      setIsSubmitting(false);
      return;
    }

    if (password.length < 8) {
      setMessage("Password must be at least 8 characters long.");
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setIsSubmitting(false);
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/admin/register",
        {
          name,
          email: email.toLowerCase(),
          password,
          confirmPassword,
        }
      );

      toast.success("Registration Successful!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setTimeout(() => {
        navigate("/login");
      }, 1000);

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      sessionStorage.clear();
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setMessage("This email is already registered. Try logging in.");
      } else {
        setMessage("Registration Failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFocus = (field) => {
    setFocusedFields((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field, value) => {
    setFocusedFields((prev) => ({ ...prev, [field]: value !== "" }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen     ">
      <div className="bg-[#63278D] p-8 rounded-lg shadow-lg w-[450px] text-white">
        <h2 className="text-2xl font-bold text-center">
          <ReactTyped
            strings={["Welcome to Our Platform!"]}
            typeSpeed={50}
            backSpeed={50}
            loop
          />
        </h2>

        {message && <p className="text-red-400 text-sm mt-2">{message}</p>}

        <form onSubmit={handleRegister} className="mt-4">
          <div className="relative w-full mb-4 top-2">
            <input
              type="text"
              id="name"
              className="peer w-full p-1 bg-transparent border-b-2 border-gray-300 text-white focus:border-white focus:outline-none transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => handleFocus("name")}
              onBlur={(e) => handleBlur("name", e.target.value)}
              required
              autoComplete="off"
            />
            <label
              htmlFor="name"
              className={`absolute left-2 transition-all ${
                focusedFields.name
                  ? "top-[-1.5rem] text-sm text-white"
                  : "top-1 text-gray-300 text-lg"
              }`}
            >
              Name
            </label>
          </div>

          <div className="relative w-full mb-4 top-4">
            <input
              type="email"
              id="email"
              className="peer w-full p-1 bg-transparent border-b-2 border-gray-300 text-white focus:border-white focus:outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
              onFocus={() => handleFocus("email")}
              onBlur={(e) => handleBlur("email", e.target.value)}
              required
              autoComplete="off"
            />
            <label
              htmlFor="email"
              className={`absolute left-2 transition-all ${
                focusedFields.email
                  ? "top-[-1.5rem] text-sm text-white"
                  : "top-1 text-gray-300 text-lg"
              }`}
            >
              Email Address
            </label>
          </div>

          <div className="relative w-full mb-4 top-6">
            <input
              type="password"
              id="password"
              className="peer w-full p-1 bg-transparent border-b-2 border-gray-300 text-white focus:border-white focus:outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => handleFocus("password")}
              onBlur={(e) => handleBlur("password", e.target.value)}
              required
              autoComplete="new-password"
            />
            <label
              htmlFor="password"
              className={`absolute left-2 transition-all ${
                focusedFields.password
                  ? "top-[-1.5rem] text-sm text-white"
                  : "top-1 text-gray-300 text-lg"
              }`}
            >
              Password
            </label>
          </div>

          <div className="relative w-full mb-4 top-8">
            <input
              type="password"
              id="confirmPassword"
              className="peer w-full p-1 bg-transparent border-b-2 border-gray-300 text-white focus:border-white focus:outline-none transition-all"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onFocus={() => handleFocus("ConfirmPassword")}
              onBlur={(e) => handleBlur("ConfirmPassword", e.target.value)}
              required
              autoComplete="new-password"
            />
            <label
              htmlFor="ConfirmPassword"
              className={`absolute left-2 transition-all ${
                focusedFields.ConfirmPassword
                  ? "top-[-1.5rem] text-sm text-white"
                  : "top-1 text-gray-300 text-lg"
              }`}
            >
              Confirm Password
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-[#8C1DE3] p-2 rounded text-white font-bold mt-8 disabled:opacity-50 disabled:cursor-not-allowed transition-transform transform hover:scale-105"
            disabled={isSubmitting}
          >
            Register
          </button>
        </form>

        <p className="text-center mt-4">
          Already registered?{" "}
          <Link to="/login" className="text-white hover:underline">
            Login here
          </Link>
        </p>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Register;