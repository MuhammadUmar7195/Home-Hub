import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

//problem solved outlet means all childrens

const PrivateRoute = () => {
  const { currentUser } = useSelector((state) => state?.user);
  return currentUser ? <Outlet /> : <Navigate to={"/signin"} />;
};

export default PrivateRoute;
