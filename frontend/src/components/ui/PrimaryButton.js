import React from "react";

const PrimaryButton = ({ children, ...props }) => (
  <button
    className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition font-semibold"
    {...props}
  >
    {children}
  </button>
);

export default PrimaryButton;