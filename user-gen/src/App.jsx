import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [nationality, setNationality] = useState("");
  const [nationalities, setNationalities] = useState([]);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(`https://randomuser.me/api/?results=50`);
        const data = response.data.results;

        // Set state with fetched data
        setUsers(data); 
        
        // Extract unique nationalities
        const uniqueNationalities = [...new Set(data.map((user) => user.location.country))];
        setNationalities(uniqueNationalities);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false)
      }
    };

    getUser();
  }, []);

  // Date formatting
  const getDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString();
  };

  // Filter function
  const filterUsers = () => {
    return users.filter((user) => {
      const nameMatch = `${user.name.first} ${user.name.last}`.toLowerCase().includes(searchQuery.toLowerCase());
      const emailMatch = user.email.toLowerCase().includes(searchQuery.toLowerCase());

      const userDob = new Date(user.dob.date);
      const start = startDate ? new Date(startDate) : new Date("1900-01-01");
      const end = endDate ? new Date(endDate) : new Date();
      const dateMatch = userDob >= start && userDob <= end;

      const nationalityMatch = nationality ? user.location.country === nationality : true;

      return (nameMatch || emailMatch) && dateMatch && nationalityMatch;
    });
  };

  const filteredUsers = filterUsers();

  return (
    <>
      <div className="flex justify-around items-center flex-wrap mb-4 mt-10 space-x-2">
        <input
          type="text"
          placeholder="Search by username or email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border-2 rounded-lg text-sm"
        />
        <div className="space-x-3">
        <label className="text-xs">Start</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-2 border-2 rounded-lg text-xs w-9"
        />
        <label className="text-xs">End</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-2 border-2 rounded-lg text-xs w-9"
        />
        <select
          value={nationality}
          onChange={(e) => setNationality(e.target.value)}
          className="p-2 border rounded-lg text-xs"
        >
          <option value="">All Nationalities</option>
          {nationalities.map((nat, index) => (
            <option key={index} value={nat}>
              {nat}
            </option>
          ))}
        </select>
        </div>
      </div>
      <div className="flex justify-center flex-wrap">
        {loading ? (
          <div className="flex items-center justify-center h-screen">
          <div className="relative">
              <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
              <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin">
              </div>
          </div>
      </div>
        ) : (
          filteredUsers.map((user, index) => (
            <div key={index} className="m-1 w-[20rem]">
              <div className="rounded-xl border bg-white px-4 pt-8 pb-10 shadow-lg">
                <div className="relative mx-auto w-[11rem] rounded-full">
                  <img
                    className="mx-auto h-auto w-full rounded-full"
                    src={user.picture.large}
                    alt=""
                  />
                </div>
                <h1 className="my-1 text-center text-xl font-bold leading-8 text-gray-900">
                  {user.name.first} {user.name.last}
                </h1>
                <h3 className="font-lg text-xs text-center leading-6 text-gray-600">
                  {user.email}
                </h3>
                <ul className="mt-3 divide-y rounded bg-gray-100 py-2 px-3 text-gray-600 shadow-sm hover:text-gray-700 hover:shadow">
                  <li className="flex items-center py-3 text-sm">
                    <span>Nationality</span>
                    <span className="ml-auto">
                      <span className="rounded-full bg-green-200 py-1 px-2 text-xs font-medium text-green-700">
                        {user.location.country}
                      </span>
                    </span>
                  </li>
                  <li className="flex items-center py-3 text-sm">
                    <span>Date of Birth</span>
                    <span className="ml-auto">{getDate(user.dob.date)}</span>
                  </li>
                </ul>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default App;
