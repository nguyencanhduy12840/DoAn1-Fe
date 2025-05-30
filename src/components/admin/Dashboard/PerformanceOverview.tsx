import React from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface Props {
  profitData: number[];
  revenueData: number[];
  months: string[];
}

const PerformanceOverview: React.FC<Props> = ({
  profitData,
  revenueData,
  months,
}) => {
  const options: ApexOptions = {
    chart: { type: "bar" },
    xaxis: { categories: months },
    yaxis: { title: { text: "USD" } },
    dataLabels: { enabled: false },
    plotOptions: { bar: { horizontal: false, columnWidth: "85%" } },
  };

  const series = [
    { name: "Total Profit", data: profitData },
    { name: "Total Revenue", data: revenueData },
  ];

  return (
    <div className="card bg-base-100 shadow-md border border-base-200 rounded-xl h-[360px]">
      <div className="card-body">
        <h2 className="text-center font-semibold text-lg">
          Revenue & Transaction
        </h2>
        <Chart options={options} series={series} type="bar" height={300} />
      </div>
    </div>
  );
};

export default PerformanceOverview;
