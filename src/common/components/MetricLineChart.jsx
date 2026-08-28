// MetricLineChart.jsx
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from "recharts";
import '../styles/metricLineChart.css'

export default function MetricLineChart({ data, title, lines, yDomain, unit }) {
  return (
    <div className="chart-card">
      <h3 className="chart-title">{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time"/>
          <YAxis domain={yDomain} unit={unit} />
          <Tooltip
            labelFormatter={(value, payload) => payload?.[0]?.payload?.fullTime ?? value}
          />
          <Legend />
          {lines.map((line) => (
            <Line
              key={line.dataKey}
              type="monotone"
              dataKey={line.dataKey}
              name={line.name}
              stroke={line.color}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}