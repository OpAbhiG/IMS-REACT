import PageHeader from "../components/PageHeader";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
);

export default function Dashboard() {
  const [totalItems, setTotalItems] = useState(0);
  const [categoryData, setCategoryData] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/api/assets`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Backend Data:", data);

        // ✅ Total items
        setTotalItems(data.length);

        // ✅ Group by item (since no category exists)
        const map = {};

        data.forEach((item) => {
          const key = item.itemName || "Others"; // 👈 you can change this field

          if (!map[key]) {
            map[key] = 0;
          }

          map[key]++;
        });

        // ✅ Convert to chart format
        const formatted = Object.keys(map).map((k) => ({
          name: k,
          value: map[k],
        }));

        setCategoryData(formatted);
      })
      .catch((err) => console.log("API Error:", err));
  }, []);

  // Category Distribution

  const doughnutData = {
    labels: categoryData.map((c) => c.name),
    datasets: [
      {
        data: categoryData.map((c) => c.value),
        backgroundColor: [
          "#2563eb",
          "#3b82f6",
          "#60a5fa",
          "#93c5fd",
          "#bfdbfe",
        ],
        borderWidth: 3,
      },
    ],
  };

  // Items per Category

  const barData = {
    labels: categoryData.map((c) => c.name),
    datasets: [
      {
        label: "Items Count",
        data: categoryData.map((c) => c.value),
        backgroundColor: "#3b82f6",
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="container py-5">
      <PageHeader
        title="Inventory Dashboard"
        subtitle="Monitor and manage your inventory system efficiently"
        icon="bi-bar-chart"
      />

      {/* TOTAL ITEMS */}
      <div className="row justify-content-center mb-5">
        <div className="col-lg-15">
          <div className="card stat-card text-center p-5 shadow">
            <h5 className="text-muted mb-3">Total Items Registered</h5>
            <h1
              className="stat-number"
              style={{
                fontSize: "5.5rem",
                fontWeight: "700",
                color: "#2563eb",
              }}
            >
              {totalItems}
            </h1>
            <div className="mt-4 d-flex justify-content-center gap-3 flex-wrap">
              <Link to="/add-item" className="btn btn-primary px-5 py-3">
                Register New Item
              </Link>
              <Link
                to="/view-items"
                className="btn btn-outline-primary px-5 py-3"
              >
                View All Items
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ CHARTS FIRST */}
      <div className="row g-4 mb-5">
        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title mb-4">Category Distribution</h5>
              <div className="chart-container">
                {categoryData.length > 0 ? (
                  <Doughnut
                    data={doughnutData}
                    options={{ maintainAspectRatio: false }}
                  />
                ) : (
                  <p className="text-center text-muted py-5">
                    Add items to see charts
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title mb-4">Items per Category</h5>
              <div className="chart-container">
                {categoryData.length > 0 ? (
                  <Bar
                    data={barData}
                    options={{
                      maintainAspectRatio: false,
                      scales: { y: { beginAtZero: true } },
                    }}
                  />
                ) : (
                  <p className="text-center text-muted py-5">
                    Add items to see bar chart
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ ITEM COUNT CARDS AFTER CHART */}
      <div className="row g-4">
        {categoryData.length > 0 ? (
          categoryData.map((cat, i) => (
            <div key={i} className="col-md-4 col-sm-6">
              <div className="card text-center p-4 h-100">
                <h5 className="mb-2">{cat.name}</h5>
                <h2 className="text-primary mb-0">{cat.value}</h2>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center text-muted py-5">
            No items yet. Register some items to see category cards.
          </div>
        )}
      </div>
    </div>
  );
}
