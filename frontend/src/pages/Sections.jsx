import SectionPage from "../components/SectionPage";

export function Overview() {
  return (
    <SectionPage
      title="Overview"
      icon="grid"
      description="High-level view of your workspace at a glance."
    >
      <div className="section-card">
        <p>
          Welcome to your LaunchPad overview. Here you&#39;ll see a summary of your
          KPIs, recent activity, and revenue trends across your organization.
        </p>
      </div>
    </SectionPage>
  );
}

export function Projects() {
  return (
    <SectionPage
title="Projects"
      icon="folder"
      description="Manage and monitor all your projects."
    >
      <div className="section-card">
        <p>
          Browse, create, and track projects. Use the dashboard to manage project
          status, owners, and deadlines.
        </p>
      </div>
    </SectionPage>
  );
}

export function Teams() {
  return (
    <SectionPage
title="Teams"
      icon="users"
      description="Manage your teams and members."
    >
      <div className="section-card">
        <p>
          Organize your employees into teams, assign roles, and collaborate
          effectively across your workspace.
        </p>
      </div>
    </SectionPage>
  );
}

export function Analytics() {
  return (
    <SectionPage
title="Analytics"
      icon="chart"
      description="Performance insights and trends."
    >
      <div className="section-card">
        <p>
          View detailed analytics on revenue, project performance, and employee
          productivity over time.
        </p>
      </div>
    </SectionPage>
  );
}

export function Finance() {
  return (
    <SectionPage
title="Finance"
      icon="finance"
      description="Track revenue, expenses and financial health."
    >
      <div className="section-card">
        <p>
          Monitor your company&#39;s financial performance, including monthly
          revenue, budgets, and expenses.
        </p>
      </div>
    </SectionPage>
  );
}

export function Reports() {
  return (
    <SectionPage
title="Reports"
      icon="report"
      description="Generate and view business reports."
    >
      <div className="section-card">
        <p>
          Create scheduled and on-demand reports for projects, finance, and
          team performance.
        </p>
      </div>
    </SectionPage>
  );
}

export function Tasks() {
  return (
    <SectionPage
title="Tasks"
      icon="tasks"
      description="Manage your pending tasks and to-dos."
    >
      <div className="section-card">
        <p>
          View and manage all pending tasks, track overdue items, and keep your
          team on schedule.
        </p>
      </div>
    </SectionPage>
  );
}

export function Settings() {
  return (
    <SectionPage
title="Settings"
      icon="settings"
      description="Configure your workspace preferences."
    >
      <div className="section-card">
        <p>
          Manage your account, workspace preferences, notifications, and
          security settings.
        </p>
      </div>
    </SectionPage>
  );
}
