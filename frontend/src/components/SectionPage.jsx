import Icon from "./Icon";

function SectionPage({ title, icon, description, children }) {
  return (
    <div className="section-page">
      <div className="section-heading">
        <span className="section-icon">
          <Icon name={icon} size={22} />
        </span>
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

export default SectionPage;
