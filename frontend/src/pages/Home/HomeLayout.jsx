import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const HomeLayout = ({ children }) => {
  return (
    <div className="container text-white min-h-screen bg-slate-950">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default HomeLayout;
