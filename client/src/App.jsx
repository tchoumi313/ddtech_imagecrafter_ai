import React from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

import { logo } from "./assets";
import { Home, CreatePost } from "./pages";

const App = () => {
  return (
    <BrowserRouter>
      <header
        className="w-full flex 
      justify-between items-center bg-[#0099ff]
      sm:px-8 px-4 border-b border-b-[#e6ebf4]"
      >
        <div className="flex ">
          <Link to="/">
            <img
              src={logo}
              alt="logo"
              className="w-28 object-contain rounded-md "
            />
          </Link>
          <span className="text-center justify-center items-center mt-10">
            <a
              className="text-stone-800 text-sm hover:bg-white hover:text-blue-700 rounded-md"
              href="https://donaldtportfolio.netlify.app"
            >
              &copy;2023 DonaldTCHOUMI
            </a>
          </span>
        </div>
        <Link
          to="/create-post"
          className="font-inter font-medium bg-blue-700 text-white hover:bg-indigo-700 px-4 py-2 rounded-md"
        >
          Create
        </Link>
      </header>
      <main
        className="sm:p-8 px-4 py-8
      w-full bg-[#f2f2f2] min-h-[calc(100vh-73px)]"
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-post" element={<CreatePost />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;
