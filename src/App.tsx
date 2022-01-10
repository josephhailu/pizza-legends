import React from "react";
import {Outlet, Link} from "react-router-dom";
import PizzaLegends from "./routes";

export default function App() {
  return (
    <div>
      <h1>Pizza Legends</h1>
      <nav
        style={{
          borderBottom: "solid 1px",
          paddingBottom: "1rem",
        }}
      >
        <Link to="/game">Pizza Legends</Link> |{" "}
        <Link to="/edit">Map Collision Editor</Link>
      </nav>

      <Outlet />
    </div>
  );
}
