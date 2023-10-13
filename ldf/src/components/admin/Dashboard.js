import React, { useState, useEffect } from "react";
import axios from "axios";

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        token: token,
      },
    };

    axios
      .get("http://localhost:5000/api/user/statistic/dashboard", config)
      .then((response) => {
        console.log("responseeeeeeeeeeeeeee", response);
        setDashboardData(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching dashboard data: ", error);
      });
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h2>Users</h2>
        <p className="dashboard-stat">
          {dashboardData ? dashboardData.numberOfUsers : "Loading..."}
        </p>
      </div>
      <div className="dashboard-card">
        <h2>Products</h2>
        <p className="dashboard-stat">
          {dashboardData ? dashboardData.numberOfProducts : "Loading..."}
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
