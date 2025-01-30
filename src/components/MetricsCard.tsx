import React from 'react';

interface MetricProps {
  label: string;
  value: string;
}

const MetricsCard = ({ label, value }: MetricProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <p className="text-bank-secondary text-sm">{label}</p>
      <p className="text-bank-primary font-semibold text-lg mt-1">{value}</p>
    </div>
  );
};

export default MetricsCard;