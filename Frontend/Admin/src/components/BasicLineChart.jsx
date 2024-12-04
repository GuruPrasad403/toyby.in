import React, { useEffect, useState } from "react";
import { LineChart } from '@mui/x-charts/LineChart';
import { useFetch } from "../hooks/useFetch";

export default function BasicLineChart() {
  const [ordersData, setOrdersData] = useState([]);
  
  // Fetch order data from the API using the useFetch hook
  const { data, error, loading } = useFetch({
    route: "api/reports/orders-by-date",
    method: "GET",
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IkFkbWluQGdtYWlsLmNvbSIsImlhdCI6MTczMTE3NTk1OX0.bhaHTB96SUPmPOAPJBpG-3OVulkIRmjSBmsKyLTY4Fg",
  });

  // Update orders data when fetched data changes
  useEffect(() => {
    if (data) {
      // Assuming `data` has the format [{ date: "2024-12-01", totalOrders: 10 }, ...]
      const formattedData = {
        xAxis: data.map(order => order.date), // Assuming 'date' is in YYYY-MM-DD format
        series: [
          {
            data: data.map(order => order.totalOrders), // Assuming 'totalOrders' is the total number of orders for that date
            label: "Orders", // Label for the data series
          }
        ]
      };
      setOrdersData(formattedData);
    }
  }, [data]);

  // Loading and error states
  if (loading) {
    return <p>Loading data...</p>;
  }

  if (error) {
    return <p>Error fetching data: {error.message}</p>;
  }

  return (
    <div className="grid h-auto w-auto">
      <LineChart
        xAxis={[{
          data: ordersData.xAxis, // Dates for x-axis
          label: 'Date', // Label for the x-axis
        }]}
        series={ordersData.series} // Data series for the chart
        width={1000} // Increased width
        height={500} // Increased height
      />
    </div>
  );
}
