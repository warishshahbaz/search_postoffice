// PincodeLookup.js
import React, { useState } from "react";

const PincodeLookup = () => {
  const [pincode, setPincode] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [allData, setAllData] = useState([]);

  const handleChange = (e) => {
    setPincode(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pincode.length !== 6 || !/^\d+$/.test(pincode)) {
      setError("Please enter a valid 6-digit Indian Postal Code.");
      return;
    }
    setLoading(true);
    try {
      let response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      response = await response.json();
      setAllData(response);
      const data = response[0]?.PostOffice ?? [];
      setFilteredData(data);
      setLoading(false);
      setError("");
    } catch (error) {
      setError("Error fetching data. Please try again later.");
      setLoading(false);
    }
  };

  const handleFilter = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = filteredData.filter((item) =>
      item.Name.toLowerCase().includes(searchTerm)
    );
    if (searchTerm) {
      setFilteredData(filtered);
    }
  };

  return (
    <div className="pincode-lookup">
      {filteredData.length <= 0 && (
        <>
          <h2>Enter Pincodes</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter 6-digit Pincode"
              value={pincode}
              onChange={handleChange}
            />
            <button type="submit">Lookup</button>
          </form>
        </>
      )}

      {error && <p className="error">{error}</p>}
      {loading && <div className="loader">Loading...</div>}
      {filteredData.length === 0 && !loading && (
        <p className="message">
          Couldn’t find the postal data you’re looking for…
        </p>
      )}
      {filteredData.length > 0 && (
        <div className="postal-details">
          <h3>Pincode : {pincode}</h3>
          <h3>{allData[0]?.Message ?? ""}</h3>
          <input
            type="text"
            placeholder="Filter by Post Office Name"
            onChange={handleFilter}
          />
          <div className="container">
            {filteredData.map((item, index) => (
              <div className="box" key={index}>
                <p>Post Office Name: {item.Name}</p>
                <p>Pincode: {item.Pincode}</p>
                <p>District: {item.District}</p>
                <p>State: {item.State}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PincodeLookup;
