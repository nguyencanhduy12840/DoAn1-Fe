import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface SummaryData {
  customers: number;
  orders: number;
  imports: number;
  monthlyProfits: { month: string; profit: number }[];
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<SummaryData>({
    customers: 0,
    orders: 0,
    imports: 0,
    monthlyProfits: [],
  });

  useEffect(() => {
    // Fake fetch API - Replace with real API call
    setTimeout(() => {
      setData({
        customers: 120,
        orders: 87,
        imports: 30,
        monthlyProfits: [
          { month: "Jan", profit: 1000 },
          { month: "Feb", profit: 1500 },
          { month: "Mar", profit: 1200 },
          { month: "Apr", profit: 1800 },
          { month: "May", profit: 900 },
          { month: "Jun", profit: 1600 },
        ],
      });
    }, 500);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Customers</h2>
            <p className="text-xl font-bold">{data.customers}</p>
          </div>
        </div>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Orders</h2>
            <p className="text-xl font-bold">{data.orders}</p>
          </div>
        </div>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Imports</h2>
            <p className="text-xl font-bold">{data.imports}</p>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Monthly Profit</h2>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.monthlyProfits}>
              <Line
                type="monotone"
                dataKey="profit"
                stroke="#4f46e5"
                strokeWidth={3}
              />
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
