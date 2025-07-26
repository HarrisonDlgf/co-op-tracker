import React, { useEffect, useState } from "react";
import UserSummary from "../components/UserSummary";
import PrimaryButton from "../components/PrimaryButton";

const Landing = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleGetStarted = () => {
    alert("Get Started clicked! (Add navigation here later)");
  }; //TODO: Implement this 

  useEffect(() => {
    fetch("/user/profile")
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 to-teal-50">
      <div className="bg-white rounded-2xl shadow-xl px-8 py-10 min-w-[320px] text-center">
        <h1 className="mb-6 text-3xl font-bold text-blue-600">
          Welcome to <span className="text-gray-900">Co-Op Tracker Pro!</span>
        </h1>
        {loading && <div className="text-gray-400">Loading...</div>}
        {!loading && user && <UserSummary user={user} />}
        {!loading && !user && <p className="text-red-500">Could not load user data.</p>}
        <PrimaryButton onClick={handleGetStarted}>Get Started</PrimaryButton>
      </div>
    </div>
  );
};

export default Landing;