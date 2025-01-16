import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getSumOfTotalCostYearly } from '../../../utils/ArithematicCalculation';

const Analytics = ({ proposalData, serviceData }) => {
  const [monthlyEarnings, setMonthlyEarnings] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");

  useEffect(() => {
    if (proposalData?.length >= 1) {
      const filteredProposalData = proposalData.filter(value => value?.status?.type === "active");

      // Extract earnings and format the data
      const earningsArray = filteredProposalData.map(proposal => {
        const filteredServiceData = serviceData?.filter(item => proposal.service?.includes(item?.uniqueid));
        const earning = getSumOfTotalCostYearly(filteredServiceData); // Calculate total earning
        const dateObj = new Date(proposal.status.date);
        const year = dateObj.getFullYear(); // Extract year
        const month = dateObj.toLocaleString('en-GB', { month: 'short' }); // Extract month
        return { year, month, earning: (earning / 12) };
      });

      // Group data by year
      const groupedByYear = earningsArray.reduce((acc, item) => {
        const key = `${item.year}`;
        acc[key] = acc[key] || [];
        acc[key].push(item);
        return acc;
      }, {});

      // Extract available years
      const years = Object.keys(groupedByYear).sort();
      setAvailableYears(years);
      setSelectedYear(years[0]); // Set the first year as default
      setMonthlyEarnings(groupedByYear);
    }
  }, [proposalData, serviceData]);

  // Filter data based on the selected year
  const filteredData = monthlyEarnings[selectedYear]?.map(item => ({
    date: `${item.month} ${item.year}`,
    earning: item.earning
  })) || [];

  return (
    <div className="box-cs">
      <div className="header">
        <h5 className="font-1 fw-700 font-size-16">Earning Based on Active Projects</h5>
        <select
          className="custom-select"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          {availableYears.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <div className="mt-2 graph" style={{ width: '100%', height: '250px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="earning"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;
