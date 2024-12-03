import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

export default function BasicLineChart() {
  return (
    <div className="grid h-auto w-auto">
      <LineChart
        xAxis={[
          {
            data: [1, 2, 3, 5, 8, 10],
            label: 'Days', // Label for the x-axis
          },
        ]}
        series={[
          {
            data: [2, 5.5, 2, 8.5, 1.5, 5],
            label: 'Orders', // Label for the data series
          },
        ]}
        width={1000} // Increased width
        height={500} // Increased height
      />
    </div>
  );
}
