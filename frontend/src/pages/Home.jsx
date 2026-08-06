import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../components/Icon";

// The demo meetings get scheduled with this host email on Google Calendar.
const HOST_EMAIL = "amarnathmishra5200@gmail.com";

// Simple stats for the "Why LaunchPad" comparison section.
const COMPARISON = [
  {
    metric: "Setup time",
    others: "Weeks of configuration",
    value: "Minutes",
    icon: "chart",
  },
  {
    metric: "Data visibility",
    others: "Scattered spreadsheets",
    value: "Live dashboard",
    icon: "grid",
  },
  {
    metric: "Project tracking",
    others: "Email & chat threads",
    value: "Centralized board",
    icon: "folder",
  },
  {
    metric: "Team insights",
    others: "Missed updates",
    value: "Real-time KPIs",
    icon: "users",
  },
];

const STATS = [
  { value: "10x", label: "Faster onboarding" },
  { value: "90%", label: "Less manual reporting" },
  { value: "24/7", label: "Live data access" },
  { value: "1", label: "Dashboard for everything" },
];

function BookDemo() {
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [link, setLink] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLink("");

    if (!email || !date || !time) {
      setError("Please fill in your email, a day, and a time.");
      return;
    }

    // Build a Google Calendar event link (action=TEMPLATE).
    // The host email is added as a guest so it lands on the founder's calendar.
    const start = new Date(`${date}T${time}`);
    const end = new Date(start.getTime() + 30 * 60 * 1000);

    const fmt = (d) => {
      const pad = (n) => String(n).padStart(2, "0");
      return (
        d.getFullYear() +
        pad(d.getMonth() + 1) +
        pad(d.getDate()) +
        "T" +
        pad(d.getHours()) +
        pad(d.getMinutes()) +
        "00"
      );
    };

    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: "LaunchPad Demo",
      dates: `${fmt(start)}/${fmt(end)}`,
      details:
        "LaunchPad product demo. I'd like to see how LaunchPad can help manage projects, analytics, and team workflows.",
      location: "Google Meet",
      add: HOST_EMAIL,
      ctz: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });

    const googleUrl = `https://calendar.google.com/calendar/render?${params.toString()}`;
    setLink(googleUrl);
  };

  return (
    <section id="book-demo" className="demo-section">
      <div className="section-container">
        <div className="section-head">
          <span className="eyebrow">Book a Demo</span>
          <h2>See LaunchPad in action</h2>
          <p className="section-sub">
            Pick a day and time that works for you. We'll send a Google Meet invite to your inbox
            and it lands on our calendar automatically.
          </p>
        </div>

        <div className="demo-card">
          <form onSubmit={handleSubmit} className="demo-form">
            <div className="field">
              <label>Your name</label>
              <input
                type="text"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Work email</label>
              <input
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Choose a day</label>
              <input
                type="date"
                required
                value={date}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Choose a time</label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>

            {error && <div className="error-box">{error}</div>}

            <button type="submit" className="btn btn-primary demo-submit">
              <Icon name="check" size={18} /> Confirm my Google Meet
            </button>
          </form>

          <div className="demo-note">
            <Icon name="shield" size={20} />
            <p>
              Once you confirm, Google Calendar opens with your chosen slot pre-filled and a
              <strong> Google Meet link</strong> ready. It's added to our calendar so we can join you
              at your scheduled time.
            </p>
          </div>

          {link && (
            <div className="demo-success">
              <p>
                <strong>You're all set!</strong> Click below to add this to your calendar (Google
                Meet is included):
              </p>
              <a className="btn btn-primary" href={link} target="_blank" rel="noreferrer">
                <Icon name="finance" size={18} /> Add to Google Calendar
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Home() {
  return (
    <div className="home-page">
      {/* ===== Header ===== */}
      <header className="home-header">
        <div className="home-header-inner">
          <Link to="/" className="home-logo">
            <img src="/LP.png" alt="LaunchPad logo" className="home-logo-img" />
          </Link>

          <nav className="home-nav">
            <a href="#why">Why LaunchPad</a>
            <a href="#founder">Founder</a>
            <a href="#book-demo">Pricing</a>
          </nav>

          <div className="home-actions">
            <Link to="/register" className="btn btn-outline-light">
              Sign up
            </Link>
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
          </div>
        </div>
      </header>

      {/* ===== Section 1: Hero ===== */}
      <section className="hero">
        <div className="hero-bg-glow" />
        <div className="section-container hero-inner">
          <span className="eyebrow">Meet LaunchPad</span>
          <h1>
            Launch your business with
            <br />
            <span className="gradient"> everything in one dashboard.</span>
          </h1>
          <p className="hero-sub">
            LaunchPad brings your projects, analytics, finances, tasks, and team workflows together
            in one intelligent, real-time workspace. No more scattered tools — just clarity.
          </p>
          <div className="hero-cta">
            <Link to="/register" className="btn btn-primary btn-lg">
              Get started free
            </Link>
            <a href="#book-demo" className="btn btn-outline-light btn-lg">
              Book a demo
            </a>
          </div>

          <div className="hero-stats">
            {STATS.map((s) => (
              <div className="hero-stat" key={s.label}>
                <div className="hero-stat-value">{s.value}</div>
                <div className="hero-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Section 2: Why LaunchPad ===== */}
      <section id="why" className="why-section">
        <div className="section-container">
          <div className="section-head">
            <span className="eyebrow">Why LaunchPad</span>
            <h2>The difference is in the data</h2>
            <p className="section-sub">
              Most teams run on slow, disconnected tools. LaunchPad gives you a single, measurable
              edge — so you spend less time managing and more time building.
            </p>
          </div>

          <div className="comparison-grid">
            {COMPARISON.map((c) => (
              <div className="comparison-card" key={c.metric}>
                <div className="comparison-icon">
                  <Icon name={c.icon} size={22} />
                </div>
                <h3>{c.metric}</h3>
                <div className="comparison-row">
                  <span className="cmp-label">Others</span>
                  <span className="cmp-others">{c.others}</span>
                </div>
                <div className="comparison-row">
                  <span className="cmp-label">LaunchPad</span>
                  <span className="cmp-value">{c.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Section 3: Founder ===== */}
      <section id="founder" className="founder-section">
        <div className="section-container founder-inner">
          <div className="founder-avatar">
            <img src="/LP1.png" alt="Amarnath Mishra" />
          </div>
          <div className="founder-text">
            <span className="eyebrow">Meet the Founder</span>
            <h2>Amarnath Mishra</h2>
            <p>
              Amarnath is a builder and problem-solver who created LaunchPad to help teams stop
              juggling a dozen disconnected tools. His mission is simple: give every business the
              clarity and speed that big enterprises have — in one beautiful, data-driven dashboard.
            </p>
            <p>
              When he's not shipping new features, Amarnath is focused on making LaunchPad the
              launchpad your business deserves to grow from.
            </p>
          </div>
        </div>
      </section>

      {/* ===== Book a Demo (Pricing / scheduling) ===== */}
      <BookDemo />

      {/* ===== Section 4: Footer ===== */}
      <footer className="home-footer">
        <div className="section-container footer-inner">
          <div className="footer-brand">
            <Link to="/" className="home-logo">
              <img src="/LP.png" alt="LaunchPad logo" className="home-logo-img" />
            </Link>
            <p>One intelligent dashboard for your entire business.</p>
          </div>

          <div className="footer-col">
            <h4>Product</h4>
            <a href="#why">Why LaunchPad</a>
            <a href="#book-demo">Pricing</a>
            <a href="#book-demo">Book a demo</a>
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            <a href="#founder">Founder</a>
            <a href="#book-demo">Contact</a>
          </div>

          <div className="footer-col">
            <h4>Get started</h4>
            <Link to="/register">Sign up</Link>
            <Link to="/login">Login</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="section-container">
            © {new Date().getFullYear()} LaunchPad. Built with care by Amarnath Mishra.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
