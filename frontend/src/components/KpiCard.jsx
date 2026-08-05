import Icon from "./Icon";

function KpiCard({ title, value, icon, trend, trendDown }) {
  return (
    <div className="kpi-card">
      <div className="kpi-top">
        <h3>{title}</h3>
        <div className={`kpi-icon ${icon?.className || ""}`}>
          {icon?.name ? <Icon name={icon.name} size={20} /> : null}
        </div>
      </div>
      <div className="kpi-value">{value}</div>
      {trend && (
        <span className={`kpi-trend ${trendDown ? "down" : ""}`}>
          {trendDown ? "▼" : "▲"} {trend}
        </span>
      )}
    </div>
  );
}

export default KpiCard;
