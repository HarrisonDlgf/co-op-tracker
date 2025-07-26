import React from "react";

const UserSummary = ({ user }) => (
  <div className="my-4">
    <h2 className="text-xl font-semibold text-gray-800">Hello, {user.name}!</h2>
    <p className="text-gray-600 mt-2">
      <span className="font-bold">Level:</span> {user.level} &nbsp;|&nbsp;
      <span className="font-bold">XP:</span> {user.xp}
    </p>
    <p className="mt-2 text-blue-500">Let's get started on your co-op journey 🚀</p>
  </div>
);

export default UserSummary;