import {
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  ComposedChart,
} from "recharts";

const data = [
  { month: "Jan", revenue: 4000 },
  { month: "Feb", revenue: 6200 },
  { month: "Mar", revenue: 8100 },
  { month: "Apr", revenue: 7300 },
  { month: "May", revenue: 9800 },
  { month: "Jun", revenue: 12000 },
];

function RevenueChart() {
  return (
    <div className="chart-box">
      <div className="panel-header">
        <div>
          <h2>Revenue Analytics</h2>
          <div className="chart-sub">Monthly revenue performance</div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={data}>
          <defs>
            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#263044" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="month"
            stroke="#64748b"
            tick={{ fill: "#64748b", fontSize: 12 }}
            axisLine={{ stroke: "#263044" }}
            tickLine={false}
          />
          <YAxis
            stroke="#64748b"
            tick={{ fill: "#64748b", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${v / 1000}k`}
          />
          <Tooltip
            contentStyle={{
              background: "#1b2436",
              border: "1px solid #334155",
              borderRadius: 10,
              color: "#e6edf7",
            }}
            labelStyle={{ color: "#94a3b8" }}
            formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="none"
            fill="url(#revGrad)"
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#6366f1"
            strokeWidth={3}
            dot={{ r: 4, fill: "#6366f1", strokeWidth: 2, stroke: "#161e2e" }}
            activeDot={{ r: 6, fill: "#22d3ee" }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RevenueChart;
