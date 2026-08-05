const ACTIVITIES = [
  { text: "Team Alpha completed Sprint 12", time: "2 min ago", color: "green" },
  { text: "Finance report generated", time: "1 hr ago", color: "blue" },
  { text: "New employee onboarded", time: "3 hrs ago", color: "purple" },
  { text: "Project Mercury moved to review", time: "5 hrs ago", color: "orange" },
];

function ActivityFeed() {
  return (
    <div className="activity-feed">
      <h2>Recent Activity</h2>

      {ACTIVITIES.map((item, idx) => (
        <div className="feed-item" key={idx}>
          <div className={`feed-dot ${item.color}`} />
          <div className="feed-content">
            <p>{item.text}</p>
            <div className="feed-time">{item.time}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ActivityFeed;
