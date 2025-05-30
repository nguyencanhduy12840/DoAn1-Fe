import React from "react";

interface SummaryCardProps {
  icon: React.ReactNode;
  title: string;
  primaryValue: string;
  primaryLabel: string;
  secondaryValue: string;
  secondaryLabel: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  icon,
  title,
  primaryValue,
  primaryLabel,
  secondaryValue,
  secondaryLabel,
}) => {
  return (
    <div className="card w-full bg-base-100 shadow-md hover:shadow-xl transition-all border border-base-200 rounded-xl">
      <div className="card-body p-4">
        <div className="flex items-center space-x-2">
          <div className="bg-primary text-white rounded-full p-2">{icon}</div>
          <h2 className="text-sm font-bold">{title}</h2>
        </div>
        <div className="mt-4 flex justify-between px-2">
          <div className="flex flex-col items-center">
            <p className="text-2xl font-bold">{primaryValue}</p>
            <p className="text-sm text-gray-500">{primaryLabel}</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-2xl font-bold">{secondaryValue}</p>
            <p className="text-sm text-gray-500">{secondaryLabel}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
