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

        // Ensure the response doesn't match banned attributes
        if (
          !banList.includes(origin) &&
          !banList.includes(life_span) &&
          !banList.includes(name)
        ) {
          setcatdata({
            imageUrl: json[0].url,
            origin,
            life_span,
            name,
          });
        } else {
          // If the response doesn't match filters or is banned, call API again
          callAPI();
        }
      }
    } catch (error) {
      console.error(error.message);
      alert("Something went wrong. Please try again");
    }
  };

  // Handle clicking on attributes (toggle ban status)
  const handleFilterClick = (filterValue) => {
    if (banList.includes(filterValue)) {
      // Remove from ban list if already banned
      setBanList(banList.filter((item) => item !== filterValue));
    } else {
      // Add to ban list
      setBanList((prevBanList) => [...prevBanList, filterValue]);
    }
  };

  return (
    <div className="app-container">
      <div className="left-panel">
        <h2>Left Panel</h2>
        <p>Some content here...</p>
      </div>

      <div className="middle-container">
        <div className="labels-container">
          {/* Randomize display of attributes */}
          <button
            className="label-btn label1"
            onClick={() => handleFilterClick(catdata.origin)}
          >
            {catdata.origin ? `Origin: ${catdata.origin}` : "Label 1"}
          </button>
          <button
            className="label-btn label2"
            onClick={() => handleFilterClick(catdata.life_span)}
          >
            {catdata.life_span ? `Life Span: ${catdata.life_span}` : "Label 2"}
          </button>
          <button
            className="label-btn label3"
            onClick={() => handleFilterClick(catdata.name)}
          >
            {catdata.name ? `Name: ${catdata.name}` : "Label 3"}
          </button>
        </div>

        <div className="image-container">
          {catdata.imageUrl ? (
            <img src={catdata.imageUrl} alt="Fetched Cat" className="image" />
          ) : (
            <p>Click "Discover" to fetch an image.</p>
          )}
        </div>
        <button className="button-container" onClick={callAPI}>
          Discover
        </button>
      </div>

      <div className="right-panel">
        <h2>Banned Attributes</h2>
        {banList.length > 0 ? (
          <ul>
            {banList.map((ban, index) => (
              <li key={index}>{ban}</li>
            ))}
          </ul>
        ) : (
          <p>No banned attributes.</p>
        )}
      </div>
    </div>
  );
}

export default App;
