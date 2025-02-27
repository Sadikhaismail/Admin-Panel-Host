import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { FiDollarSign, FiUsers, FiCreditCard, FiActivity } from "react-icons/fi";
import axios from "axios";
import UserProfile from "./UserProfile";
import { useNavigate } from "react-router-dom";

const data = [
  { name: "Jan", value: 2000 },
  { name: "Feb", value: 4000 },
  { name: "Mar", value: 3500 },
  { name: "Apr", value: 6000 },
  { name: "May", value: 2500 },
  { name: "Jun", value: 3000 },
  { name: "Jul", value: 4500 },
  { name: "Aug", value: 3200 },
  { name: "Sep", value: 3700 },
  { name: "Oct", value: 5200 },
  { name: "Nov", value: 2000 },
  { name: "Dec", value: 2100 },
];

const Dashboard = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token"); 

        if (!token) {
          throw new Error("No token found. Please log in.");
        }

        const res = await axios.get("https://admin-panel-host-backend.onrender.com/api/admin/admin", {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });

        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user details:", err);
        setError("Failed to fetch user details. Please log in again.");
      }
    };

    fetchUser();
  }, []);

  

  const getInitials = (name) => {
    return name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "";
  };

  const handleLogout = async () => {
    try {
      await axios.post("https://admin-panel-host-backend.onrender.com/api/admin/logout", {}, { withCredentials: true });
      
      localStorage.removeItem("token"); 
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }
  };
  

  return (
    <div className=" min-h-screen text-white pl-10 pr-10 pt-5 mb-9">
      {/* Navbar */}
      <nav className="flex justify-between items-center pb-5 border-b border-gray-500">
        <div className="flex space-x-6">
          <span className="font-semibold text-300">Overview</span>
          <span className="text-gray-300">Analytics</span>
          <span className="text-gray-300">Reports</span>
          <span className="text-gray-300">Settings</span>
        </div>

        {/* Profile Dropdown */}
        <div
          className="relative z-50"
          onMouseEnter={() => setDropdownOpen(true)}
          onMouseLeave={() => setDropdownOpen(false)}
        >
          <div className="bg-white text-black w-10 h-10 rounded-full flex items-center justify-center cursor-pointer">
            {user ? getInitials(user.name) : "?"}
          </div>

          {dropdownOpen && user && (
            <div className="absolute right-0 mt-2 w-40 bg-white text-black border rounded-lg shadow-lg z-50">
              <div className="px-4 py-2 border-b">
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
              {error && <p className="text-red-500">{error}</p>}
              <ul className="py-2">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Billing</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b">Settings</li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500"
                  onClick={handleLogout}
                >
                  Log out
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-4 gap-6 mt-7">
        {[
          { title: "Total Revenue", value: "$45,231.89", change: "+20.1%", icon: <FiDollarSign /> },
          { title: "Subscriptions", value: "+2350", change: "+180.1%", icon: <FiUsers /> },
          { title: "Sales", value: "+12,234", change: "+19%", icon: <FiCreditCard /> },
          { title: "Active Now", value: "+573", change: "+201", icon: <FiActivity /> },
        ].map((card, index) => (
          <div key={index} className="bg-white text-black p-7 rounded-lg relative">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-lg">{card.title}</p>
                <h2 className="text-2xl font-bold mt-2">{card.value}</h2>
                <p className="text-gray-500 mt-1">{card.change} from last month</p>
              </div>
              <div className="text-gray-400 text-2xl">{card.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Graph and Recent Sales */}
      <div className="flex gap-5 mt-6">
        <div className="bg-white text-black p-4 rounded-lg w-[900px]">
          <h2 className="font-bold text-3xl mb-10">Overview</h2>
          <ResponsiveContainer width="100%" height={430}>
            <BarChart data={data}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Bar dataKey="value" fill="#877ED3" barSize={45} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Sales */}
        <div className="bg-white text-black p-4 rounded-lg w-1/2">
          <h2 className="font-bold text-3xl">Recent Sales</h2>
          <div className="space-y-3 mt-3">
            {[
              { name: "Olivia Martin", email: "olivia.martin@email.com", amount: "$1,999.00" },
              { name: "Jackson Lee", email: "jackson.lee@email.com", amount: "$39.00" },
              { name: "Isabella Nguyen", email: "isabella.nguyen@email.com", amount: "$299.00" },
              { name: "William Kim", email: "will@email.com", amount: "$99.00" },
              { name: "Sofia Davis", email: "sofia.davis@email.com", amount: "$39.00" },
            ].map((sale, index) => (
              <div key={index} className="flex items-center justify-between pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-300 text-black rounded-full flex items-center justify-center font-semibold text-lg ml-7">
                    {getInitials(sale.name)}
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{sale.name}</p>
                    <p className="text-gray-600 text-sm mb-3">{sale.email}</p>
                  </div>
                </div>
                <p className="font-semibold text-lg mr-10">{sale.amount}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <UserProfile />
    </div>
    
  );
};

export default Dashboard;