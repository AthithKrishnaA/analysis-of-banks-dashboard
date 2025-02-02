import React from 'react';

export const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border rounded shadow-lg">
        <p className="text-sm font-semibold">{new Date(label).toLocaleDateString()}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: ₹{entry.value.toFixed(2)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};