import React, { useState, useEffect } from "react";


const ParkingTable = () => {
  const [parkingData, setParkingData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchParkingData = async () => {
    const token = localStorage.getItem('access_token'); // Retrieve the token from storage
    if (!token) {
        alert('You must be logged in to access this page');
        window.location.href = '/login'; // Redirect to login page
        return;
    }
    setLoading(true);
    try {
        console.log("Token:", token);

      const response = await fetch('/parking', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });

      if (response.status === 401) {
        alert('Unauthorized! Please log in again.');
        window.location.href = '/login';
      } else {
        const data = await response.json();
        console.log('Table data:', data);
        setParkingData(data);
      }
    } catch (error) {
      console.error("Error fetching parking data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParkingData();
  }, []);

  const getMarkerColor = (availableSpaces, capacity) => {
    if (!capacity || capacity === 0) return "gray"; // Handle cases with no capacity info

    const percentage = (availableSpaces / capacity) * 100;
    if (percentage > 10) return "green";
    if (percentage > 0) return "orange";
    return "red";
  };

  return (
    <div>
      <h1>Amsterdam Parking Lots</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table style={{
            borderCollapse: "collapse", 
          }}>
          <thead>
            <tr>
              <th style={{ border: "2px solid black" }} rowSpan={2}>Name</th>
              <th style={{ border: "2px solid black" }} colSpan={2}>Up to 1 day</th>
              <th style={{ border: "2px solid black" }} colSpan={2}>More than 1 day</th>
              <th style={{ border: "2px solid black" }} rowSpan={2}>Location (Lat, Lng)</th>
            </tr>
            <tr>
              <th style={{ border: "1px solid black", borderBottom: "2px solid black" }}>Available</th>
              <th style={{ border: "1px solid black", borderRight: "2px solid black", borderBottom: "2px solid black" }}>Capacity</th>
              <th style={{ border: "1px solid black", borderBottom: "2px solid black" }}>Available</th>
              <th style={{ border: "1px solid black", borderBottom: "2px solid black" }}>Capacity</th>
            </tr>
            
          </thead>
          <tbody>
            
            {parkingData.map((lot) => (
              <tr key={lot.id}>
                <td style={{ border: "2px solid black", borderBottom: "2px solid black" }}>{lot.name}</td>
                <td style={{ border: "1px solid black", borderBottom: "2px solid black" }}>
                <span
                  style={{
                    display: "inline-block",
                    marginRight: "8px",
                    width: "10px",
                    height: "10px",
                    backgroundColor: getMarkerColor(
                      lot.freeSpaceShort,
                      lot.shortCapacity
                    ),
                    borderRadius: "50%",
                  }}
                ></span>
                {lot.freeSpaceShort}
                </td>
                <td style={{ border: "1px solid black", borderRight: "2px solid black", borderBottom: "2px solid black" }}>{lot.shortCapacity}</td>
                <td style={{ border: "1px solid black", borderBottom: "2px solid black" }}>
                <span
                  style={{
                    display: "inline-block",
                    marginRight: "8px",
                    width: "10px",
                    height: "10px",
                    backgroundColor: getMarkerColor(
                      lot.freeSpaceLong,
                      lot.longCapacity
                    ),
                    borderRadius: "50%",
                  }}
                ></span>
                {lot.freeSpaceLong}
                </td>
                <td  style={{ border: "1px solid black", borderBottom: "2px solid black" }}>{lot.longCapacity}</td>
                <td style={{ border: "2px solid black" }}>
                  {lot.latitude}, {lot.longitude}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ParkingTable;