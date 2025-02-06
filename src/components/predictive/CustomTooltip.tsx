import React from 'react';

export const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const formatValue = (value: any) => {
      // Handle percentage values
      if (typeof value === 'string' && value.endsWith('%')) {
        return value;
      }
      
      // Handle numeric values
      if (typeof value === 'number') {
        // If it's a large number (like volume), format with commas
        if (value > 1000) {
          return new Intl.NumberFormat().format(value);
        }
        // For regular numbers, show 2 decimal places
        return value.toFixed(2);
      }
      
      // For any other type, return as is
      return value;
    };

    const formatLabel = (label: string) => {
      // If label is a date string, format it
      if (label && !isNaN(Date.parse(label))) {
        return new Date(label).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
      return label;
    };

    return (
      <div className="bg-white p-4 border rounded shadow-lg">
        <p className="text-sm font-semibold">{formatLabel(label)}</p>
        {payload.map((entry: any, index: number) => {
          const value = formatValue(entry.value);
          // Add currency symbol for price values
          const displayValue = entry.name.toLowerCase().includes('price') ? 
            `₹${value}` : value;
            
          return (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {displayValue}
            </p>
          );
        })}
      </div>
    );
  }
  return null;
};