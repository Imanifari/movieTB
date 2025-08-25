import { useState } from "react";
import "./App.css";
import Search from "./components/Search";

function App() {
  const [search, setSearch] = useState("");
  return (
    <main>
      <div className="pattern" />
      <img src="./BG.png" className="absolute" alt="Hero Background" />
      <div className="wrapper">
        <header>
          <img src="./hero-img.png" alt="Hero Banner" />
          <h1 className="">
            Find <span className="text-gradient">Movie</span> You'll Enjoy
            without Hassle
          </h1>
          <Search search={search} setSearch={setSearch} />
        </header>
      </div>
    </main>
  );
}

export default App;
