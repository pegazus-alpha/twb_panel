import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import 'chart.js/auto';

export default function Graphiques() {
  const [data, setData] = useState({ depots: [], retraits: [], dates: [] });

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("/api/admin/stats"); // API personnalisée à créer
      setData(res.data);
    };
    fetchData();
  }, []);

  const chartData = {
    labels: data.dates,
    datasets: [
      {
        label: "Dépôts",
        data: data.depots,
        borderColor: "green",
        fill: false,
      },
      {
        label: "Retraits",
        data: data.retraits,
        borderColor: "red",
        fill: false,
      },
      {
        label: "Commissions",
        data: data.commissions,
        borderColor: "blue",
        fill: false,
      },
    ],
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-2">Tendance financière</h2>
      <Line data={chartData} />
    </div>
  );
}
