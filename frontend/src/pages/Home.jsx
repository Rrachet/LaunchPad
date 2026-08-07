import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../components/Icon";

// The demo meetings get scheduled with this host email on Google Calendar.
const HOST_EMAIL = "amarnathmishra5200@gmail.com";

// Apply the saved theme on first load (before React renders) to avoid a flash.
(function () {
  try {
    const saved = localStorage.getItem("lp-theme");
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    const theme = saved || (prefersLight ? "light" : "dark");
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {
    /* ignore */
  }
})();

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

// Build Google Calendar dates param from a Date (YYYYMMDDTHHMM00).
const fmtDateParam = (d) => {
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

// Generate the next N days (Mon-Sun) as quick-pick date chips starting today.
function nextDays(count = 14) {
  const out = [];
  const today = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    out.push(d);
  }
  return out;
}

// Predefined time slots in 24h format (HH:MM). AM/PM toggle changes the 12h display.
const TIME_SLOTS_24 = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
];

function to12h(hh24) {
  const [h, m] = hh24.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return { text: `${hh}:${String(m).padStart(2, "0")} ${suffix}`, hour: h, suffix };
}

function BookDemo() {
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [time24, setTime24] = useState("");
  const [name, setName] = useState("");
  const [ampm, setAmpm] = useState("AM");
  const [error, setError] = useState("");
  const [link, setLink] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [sending, setSending] = useState(false);

  const days = nextDays(14);

  // Convert the 12h display period selection into a 24h slot.
  const slotTo24 = (slot24) => {
    const { hour, suffix } = to12h(slot24);
    if (ampm === "PM" && hour < 12) return `${hour + 12}:${slot24.slice(3)}`;
    if (ampm === "AM" && hour === 12) return `00:${slot24.slice(3)}`;
    return slot24;
  };

  const handleTimeSelect = (slot24) => {
    setTime24(slotTo24(slot24));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !date || !time24) {
      setError("Please pick a day and a time.");
      return;
    }

    // Build a Google Calendar event link (action=TEMPLATE).
    const start = new Date(`${date}T${time24}`);
    const end = new Date(start.getTime() + 30 * 60 * 1000);

    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: "LaunchPad Demo",
      dates: `${fmtDateParam(start)}/${fmtDateParam(end)}`,
      details:
        "LaunchPad product demo. I'd like to see how LaunchPad can help manage projects, analytics, and team workflows.",
      location: "Google Meet",
      add: HOST_EMAIL,
      ctz: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });

    const googleUrl = `https://calendar.google.com/calendar/render?${params.toString()}`;
    setLink(googleUrl);
    setShowModal(true);

    // Notify the host by email with the details the user entered.
    setSending(true);
    try {
      const API = (await import("../services/api")).default;
      await API.post("/demo/book", {
        name,
        email,
        date,
        time: time24,
      });
    } catch (err) {
      // Email is best-effort; the calendar link still works.
      console.error("Failed to notify host:", err);
    } finally {
      setSending(false);
    }
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
            <div className="field field-full">
              <label>Your name</label>
              <input
                type="text"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="field field-full">
              <label>Work email</label>
              <input
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Easier date entry: quick-pick day chips + native date input */}
            <div className="field field-full">
              <label>Choose a day</label>
              <div className="day-chips">
                {days.map((d) => {
                  const key = d.toISOString().split("T")[0];
                  const active = date === key;
                  return (
                    <button
                      type="button"
                      key={key}
                      className={`day-chip${active ? " active" : ""}`}
                      onClick={() => setDate(key)}
                    >
                      <span className="day-chip-title">
                        {d.toLocaleDateString(undefined, { weekday: "short" })}
                      </span>
                      <span className="day-chip-date">
                        {d.getDate()} {d.toLocaleDateString(undefined, { month: "short" })}
                      </span>
                    </button>
                  );
                })}
              </div>
              <input
                type="date"
                className="date-input-inline"
                value={date}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            {/* Time: 24h slots with an AM/PM toggle */}
            <div className="field field-full">
              <label>Choose a time</label>
              <div className="ampm-toggle">
                <button
                  type="button"
                  className={ampm === "AM" ? "active" : ""}
                  onClick={() => setAmpm("AM")}
                >
                  AM
                </button>
                <button
                  type="button"
                  className={ampm === "PM" ? "active" : ""}
                  onClick={() => setAmpm("PM")}
                >
                  PM
                </button>
              </div>
              <div className="time-grid">
                {TIME_SLOTS_24.map((slot) => {
                  const { text } = to12h(slot);
                  const active = time24 === slotTo24(slot);
                  return (
                    <button
                      type="button"
                      key={slot}
                      className={`time-chip${active ? " active" : ""}`}
                      onClick={() => handleTimeSelect(slot)}
                    >
                      {text}
                    </button>
                  );
                })}
              </div>
            </div>

            {error && <div className="error-box">{error}</div>}

            <button type="submit" className="btn btn-primary demo-submit" disabled={sending}>
              <Icon name="check" size={18} />{" "}
              {sending ? "Confirming…" : "Confirm my Google Meet"}
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
        </div>
      </div>

      {/* Success popup */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">
              <Icon name="check" size={28} />
            </div>
            <h3>You're all set!</h3>
            <p>
              Hey, you're all set — now add this to your calendar too. We've also emailed your
              details to our team so we can join you at the scheduled time.
            </p>
            <div className="modal-actions">
              <a
                className="btn btn-primary"
                href={link}
                target="_blank"
                rel="noreferrer"
                onClick={() => setShowModal(false)}
              >
                <Icon name="finance" size={18} /> Add to Google Calendar
              </a>
              <button className="btn btn-outline-light" onClick={() => setShowModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function Home() {
  const [theme, setTheme] = useState(() =>
    typeof document !== "undefined"
      ? document.documentElement.getAttribute("data-theme") || "dark"
      : "dark"
  );
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("lp-theme", next);
    } catch (e) {
      /* ignore */
    }
  };

  const goTo = (hash) => {
    setMenuOpen(false);
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="home-page">
      {/* ===== Header ===== */}
      <header className="home-header">
        <div className="home-header-inner">
          <Link to="/" className="home-logo">
            <img src="/LP1.png" alt="LaunchPad logo" className="home-logo-img" />
          </Link>

          <nav className="home-nav">
            <a href="#why" onClick={(e) => { e.preventDefault(); goTo("#why"); }}>Why LaunchPad</a>
            <a href="#founder" onClick={(e) => { e.preventDefault(); goTo("#founder"); }}>Founder</a>
            <a href="#book-demo" className="nav-demo-cta" onClick={(e) => { e.preventDefault(); goTo("#book-demo"); }}>Book a demo</a>
          </nav>

          <div className="home-actions">
            <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
              <Icon name={theme === "dark" ? "sun" : "moon"} size={18} />
            </button>
            <Link to="/login" className="btn btn-primary home-login-btn">
              Login
            </Link>
            <button
              className="menu-burger"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <Icon name="close" size={22} /> : <Icon name="menu" size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="home-mobile-menu">
            <a href="#why" onClick={(e) => { e.preventDefault(); goTo("#why"); }}>Why LaunchPad</a>
            <a href="#founder" onClick={(e) => { e.preventDefault(); goTo("#founder"); }}>Founder</a>
            <a href="#book-demo" onClick={(e) => { e.preventDefault(); goTo("#book-demo"); }}>Book a demo</a>
            <div className="mobile-menu-actions">
              <Link to="/register" className="btn btn-outline-light" onClick={() => setMenuOpen(false)}>
                Sign up
              </Link>
              <Link to="/login" className="btn btn-primary" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
            </div>
          </div>
        )}
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
