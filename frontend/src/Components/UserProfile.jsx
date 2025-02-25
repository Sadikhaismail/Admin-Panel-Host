import { useState, useEffect } from "react";
import axios from "axios";
import { FaChevronDown } from "react-icons/fa"; 
import { IoIosArrowRoundUp } from "react-icons/io";
import { IoIosArrowRoundDown } from "react-icons/io";


const UserProfileList = () => {
  const [profiles, setProfiles] = useState([]);
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 5;

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get("https://admin-panel-host-backend.onrender.com/api/profile/list");
        setProfiles(response.data);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };
    fetchProfiles();
  }, []);

  const filteredData = filter
    ? profiles.filter((profile) =>
        profile.email.toLowerCase().includes(filter.toLowerCase())
      )
    : profiles;

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  return (
    <div className="max-w-9xl h-[650px] mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-300 mt-6 relative">
    
<div className="mb-4">
  <h2 className="text-3xl font-semibold text-black mb-5">User Profiles</h2>

  <div className="flex justify-between items-center">
    <input
      type="text"
      placeholder="Filter emails..."
      value={filter}
      onChange={(e) => setFilter(e.target.value)}
      className="w-[450px] h-14 p-2 border-2 border-gray-400 rounded-xl text-black"
    />

    <button className="flex items-center text-black border px-4 py-2 rounded-lg border-gray-400">
      Columns <FaChevronDown className="ml-2" />
    </button>
  </div>
</div>


<div className="border-2 border-gray-300 rounded-md h-[383px]">
  <div className="flex font-semibold  p-4 border-b">
    <div className="flex-1 px-1   text-gray-700">Status</div>
    
    <div className="flex-1 mr-96 text-gray-700 flex items-center">
  Email 
  <span className="flex flex-row ml-2 text-gray-600 text-lg leading-none">
    <IoIosArrowRoundUp className="-mr-1 scale-125" />
    <IoIosArrowRoundDown className="scale-125" />
  </span>
</div>



    <div className="flex-1 mr-48 text-gray-700 text-right">Amount</div>
  </div>



  {paginatedData.length > 0 ? (
    paginatedData.map((profile, index) => (
      <div key={index} className="flex p-5 border-b border-gray-300 ">
        <div className="flex-1  text-black font-semibold">{profile.status}</div>
        <div className="flex-1 mr-96  text-black font-semibold">{profile.email}</div> 
        <div className="flex-1 px-2 text-black text-right mr-16 font-semibold">
           ${profile.amount?.toFixed(2)} 
        </div>
        <div className="w-8 px-2 text-black text-right font-semibold mr-24">...</div> 
      </div>
    ))
  ) : (
    <div className="p-3 text-center text-black">No users found</div>
  )}
</div>


      
      {totalPages > 1 && (
  <div className="flex justify-between items-center mt-4">
  
  <span className="text-gray-700 ml-2">
       {currentPage + 1}  of  {totalPages} row(s) selected
  </span>


  <div className="flex items-center space-x-4">
    <button
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
      disabled={currentPage === 0}
      className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-300 disabled:opacity-50 text-gray-700"
    >
      Previous
    </button>
    
    <button
      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
      disabled={currentPage === totalPages - 1}
      className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-300 disabled:opacity-50 text-gray-700"
    >
      Next
    </button>
  </div>
</div>

    
     
      )}
    </div>
  );
};

export default UserProfileList;