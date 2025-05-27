"use client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Router from "../routes/Router";

export default function Home() {
  return (
    <div className="">
      
      <BrowserRouter>

        <Routes>
          <Route path="/*" element={<Router />} />

        </Routes>
      </BrowserRouter>
    

    </div>
  );
}
