/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

export const ButtonLink = ({ to, children }) => (
  <Link to={to} className="bg-indigo-500 px-4 py-1 rounded-md hover:bg-indigo-600 duration-150">
    {children}
  </Link>
);