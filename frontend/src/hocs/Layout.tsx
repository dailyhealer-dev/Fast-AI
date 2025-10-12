import React, { useEffect, PropsWithChildren } from "react";
import Navbar from "../containers/Navbar";
import { useAppDispatch, useAppSelector } from "../redux/app/hooks";
import { checkAuthenticated, loadUser } from "../redux/features/auth/authSlice";
import { useLocation } from "react-router-dom";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuthenticated()).then(() => {
      dispatch(loadUser());
    });
  }, [dispatch]);

  const authPages = ["/login", "/signup", "/activate/:uid/:token", "/reset-password", "/password/reset/confirm/:uid/:token"];
  const isAuthPage = authPages.includes(location.pathname);

  return (
    <div>
      <Navbar />
      <div className={isAuthPage ? "App" : ""}>{children}</div>
    </div>
  );
};

export default Layout;
