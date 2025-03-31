import { useState } from "react";
import "./App.css";

function App() {
  const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;
  const [catdata, setcatdata] = useState({
    imageUrl: "",
    origin: "",
    life_span: "",
    name: "",
  });

  const [selectedFilters, setSelectedFilters] = useState([]); 
  const [banList, setBanList] = useState([]); 

  // Fetch the API data
  const callAPI = async () => {
    try {
      let query = `https://api.thecatapi.com/v1/images/search?has_breeds=1&api_key=${ACCESS_KEY}`;
      const response = await fetch(query);
      const json = await response.json();

      if (json && Array.isArray(json) && json.length > 0 && json[0]) {
        const breed = json[0].breeds && json[0].breeds[0];
        const origin = breed?.origin || "Unknown";
        const life_span = breed?.life_span || "Unknown";
        const name = breed?.name || "Unknown";

        