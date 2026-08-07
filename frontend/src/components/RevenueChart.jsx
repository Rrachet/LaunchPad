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
<CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="month"
            stroke="var(--text-dim)"
            tick={{ fill: "var(--text-dim)", fontSize: 12 }}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={false}
          />
          <YAxis
            stroke="var(--text-dim)"
            tick={{ fill: "var(--text-dim)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${v / 1000}k`}
          />
          <Tooltip
            contentStyle={{
              background: "var(--card-hover)",
              border: "1px solid var(--border-light)",
              borderRadius: 10,
              color: "var(--text)",
            }}
            labelStyle={{ color: "var(--text-muted)" }}
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
            stroke="var(--blue)"
            strokeWidth={3}
            dot={{ r: 4, fill: "var(--blue)", strokeWidth: 2, stroke: "var(--card)" }}
            activeDot={{ r: 6, fill: "var(--accent)" }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RevenueChart;
