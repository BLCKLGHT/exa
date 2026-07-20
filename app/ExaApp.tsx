"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type View =
  | "dashboard"
  | "clients"
  | "domains"
  | "websites"
  | "renewals"
  | "projects"
  | "settings";

type SearchItem = {
  type: string;
  title: string;
  detail: string;
  view: View;
};

const clients = [
  {
    initials: "AB",
    name: "Aster & Bloom",
    industry: "Hospitality",
    health: 96,
    status: "Healthy",
    domain: "asterandbloom.com.au",
    website: "Squarespace",
    contact: "Mia Chen",
    email: "mia@asterandbloom.com.au",
    project: "Winter campaign",
    revenue: "$3,850",
    tone: "plum",
  },
  {
    initials: "NR",
    name: "North River Studio",
    industry: "Architecture",
    health: 88,
    status: "Healthy",
    domain: "northriver.studio",
    website: "Next.js",
    contact: "Theo Grant",
    email: "theo@northriver.studio",
    project: "Portfolio refresh",
    revenue: "$2,600",
    tone: "blue",
  },
  {
    initials: "FH",
    name: "Field House",
    industry: "Retail",
    health: 72,
    status: "Attention",
    domain: "fieldhouse.com.au",
    website: "Shopify",
    contact: "Lena Ford",
    email: "lena@fieldhouse.com.au",
    project: "Commerce migration",
    revenue: "$4,200",
    tone: "amber",
  },
  {
    initials: "MC",
    name: "Morrow Coffee",
    industry: "Food & beverage",
    health: 91,
    status: "Healthy",
    domain: "morrowcoffee.com",
    website: "Squarespace",
    contact: "James Morrow",
    email: "james@morrowcoffee.com",
    project: "Subscription launch",
    revenue: "$1,950",
    tone: "green",
  },
  {
    initials: "SF",
    name: "Southside Foundation",
    industry: "Not-for-profit",
    health: 64,
    status: "At risk",
    domain: "southsidefoundation.org",
    website: "WordPress",
    contact: "Amara Singh",
    email: "amara@southsidefoundation.org",
    project: "Annual report",
    revenue: "$2,100",
    tone: "red",
  },
];

const domains = [
  { name: "fieldhouse.com.au", client: "Field House", registrar: "GoDaddy", expiry: "8 Aug 2026", days: 19, renew: true, ssl: "Healthy" },
  { name: "southsidefoundation.org", client: "Southside Foundation", registrar: "Namecheap", expiry: "26 Aug 2026", days: 37, renew: false, ssl: "Healthy" },
  { name: "asterandbloom.com.au", client: "Aster & Bloom", registrar: "VentraIP", expiry: "14 Nov 2026", days: 117, renew: true, ssl: "Healthy" },
  { name: "northriver.studio", client: "North River Studio", registrar: "Cloudflare", expiry: "2 Feb 2027", days: 197, renew: true, ssl: "Healthy" },
  { name: "morrowcoffee.com", client: "Morrow Coffee", registrar: "Cloudflare", expiry: "18 Apr 2027", days: 272, renew: true, ssl: "Healthy" },
];

const projects = [
  { name: "Commerce migration", client: "Field House", progress: 68, due: "24 Jul", status: "In progress", owner: "Ben" },
  { name: "Winter campaign", client: "Aster & Bloom", progress: 84, due: "29 Jul", status: "In progress", owner: "Ben" },
  { name: "Annual report", client: "Southside Foundation", progress: 42, due: "4 Aug", status: "At risk", owner: "Ben" },
  { name: "Subscription launch", client: "Morrow Coffee", progress: 18, due: "18 Aug", status: "Planned", owner: "Ben" },
  { name: "Portfolio refresh", client: "North River Studio", progress: 100, due: "12 Jul", status: "Complete", owner: "Ben" },
];

const tasks = [
  { title: "Review Field House staging site", meta: "Field House · Commerce migration", time: "9:30 AM", priority: "High" },
  { title: "Send Aster & Bloom campaign copy", meta: "Aster & Bloom · Winter campaign", time: "11:00 AM", priority: "Normal" },
  { title: "Check Southside domain renewal", meta: "Southside Foundation · Domain", time: "2:00 PM", priority: "High" },
  { title: "Prepare Morrow subscription notes", meta: "Morrow Coffee · Project", time: "4:30 PM", priority: "Normal" },
];

const activity = [
  { icon: "↗", text: "Staging site updated", client: "Field House", time: "18m" },
  { icon: "✓", text: "Invoice marked current", client: "Aster & Bloom", time: "1h" },
  { icon: "＋", text: "New contact added", client: "North River Studio", time: "3h" },
  { icon: "●", text: "Support note logged", client: "Morrow Coffee", time: "Yesterday" },
];

const nav: { id: View; label: string; icon: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: "⌂" },
  { id: "clients", label: "Clients", icon: "◫" },
  { id: "domains", label: "Domains", icon: "◎" },
  { id: "websites", label: "Websites", icon: "◇" },
  { id: "renewals", label: "Renewals", icon: "↻" },
  { id: "projects", label: "Projects", icon: "▤" },
];

const launchLinks = [
  ["Website", "↗", "https://example.com"],
  ["Squarespace", "S", "https://www.squarespace.com"],
  ["Cloudflare", "C", "https://dash.cloudflare.com"],
  ["Google Admin", "G", "https://admin.google.com"],
  ["Google Drive", "D", "https://drive.google.com"],
  ["Asana", "A", "https://app.asana.com"],
  ["Notion SOP", "N", "https://www.notion.so"],
  ["1Password", "1", "https://start.1password.com"],
];

const allSearchItems: SearchItem[] = [
  ...clients.map((client) => ({ type: "Client", title: client.name, detail: `${client.industry} · ${client.status}`, view: "clients" as View })),
  ...domains.map((domain) => ({ type: "Domain", title: domain.name, detail: `${domain.client} · ${domain.registrar}`, view: "domains" as View })),
  ...projects.map((project) => ({ type: "Project", title: project.name, detail: `${project.client} · ${project.status}`, view: "projects" as View })),
  ...clients.map((client) => ({ type: "Contact", title: client.contact, detail: `${client.name} · ${client.email}`, view: "clients" as View })),
  ...clients.map((client) => ({ type: "Website", title: client.domain, detail: `${client.name} · ${client.website}`, view: "websites" as View })),
  { type: "Support", title: "Analytics access restored", detail: "Morrow Coffee · 14 July", view: "clients" },
  { type: "Support", title: "DNS records updated", detail: "Field House · 11 July", view: "clients" },
];

function BrandMark() {
  return <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>;
}

function MiniChart() {
  return (
    <div className="mini-chart" aria-label="Revenue trend rising">
      {[36, 47, 42, 58, 52, 68, 62, 78, 72, 87, 82, 96].map((height, index) => (
        <i key={index} style={{ height: `${height}%` }} />
      ))}
    </div>
  );
}

export default function ExaApp() {
  const [view, setView] = useState<View>("dashboard");
  const [selectedClient, setSelectedClient] = useState<(typeof clients)[number] | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  const [toast, setToast] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const searchResults = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return allSearchItems.slice(0, 7);
    return allSearchItems
      .filter((item) => `${item.type} ${item.title} ${item.detail}`.toLowerCase().includes(value))
      .slice(0, 9);
  }, [query]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === "Escape") {
        setSearchOpen(false);
        setQuery("");
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    if (searchOpen) window.setTimeout(() => searchRef.current?.focus(), 40);
  }, [searchOpen]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const goTo = (next: View) => {
    setSelectedClient(null);
    setView(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openSearchResult = (item: SearchItem) => {
    setSearchOpen(false);
    setQuery("");
    goTo(item.view);
    if (item.type === "Client") {
      const match = clients.find((client) => client.name === item.title);
      if (match) setSelectedClient(match);
    }
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><BrandMark /><span>EXA</span></div>
        <nav aria-label="Main navigation">
          <p className="nav-label">Workspace</p>
          {nav.map((item) => (
            <button key={item.id} className={`nav-item ${view === item.id && !selectedClient ? "active" : ""}`} onClick={() => goTo(item.id)}>
              <span className="nav-icon">{item.icon}</span><span>{item.label}</span>
              {item.id === "renewals" && <em>2</em>}
            </button>
          ))}
          <p className="nav-label second">System</p>
          <button className="nav-item" onClick={() => setSearchOpen(true)}><span className="nav-icon">⌕</span><span>Search</span><kbd>⌘K</kbd></button>
          <button className={`nav-item ${view === "settings" ? "active" : ""}`} onClick={() => goTo("settings")}><span className="nav-icon">⚙</span><span>Settings</span></button>
        </nav>
        <div className="sidebar-footer">
          <div className="system-status"><span /><div><strong>All systems operational</strong><small>Checked 4m ago</small></div></div>
          <div className="profile">
            <div className="avatar">BH</div>
            <div><strong>Ben Hayes</strong><small>Hayes Communications</small></div>
            <button aria-label="Open account menu">•••</button>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="mobile-brand" onClick={() => goTo("dashboard")} aria-label="Go to dashboard"><BrandMark /><span>EXA</span></button>
          <div className="crumb"><span>Hayes Communications</span><b>/</b><strong>{selectedClient?.name ?? nav.find((item) => item.id === view)?.label ?? "Settings"}</strong></div>
          <button className="search-trigger" onClick={() => setSearchOpen(true)}><span>⌕</span><span>Search anything…</span><kbd>⌘ K</kbd></button>
          <button className="quick-add" onClick={() => setToast("Quick add is ready to connect")}>＋ <span>Quick add</span></button>
        </header>

        <div className="content">
          {selectedClient ? (
            <ClientDetail client={selectedClient} onBack={() => setSelectedClient(null)} setToast={setToast} />
          ) : view === "dashboard" ? (
            <Dashboard onView={goTo} onClient={setSelectedClient} completedTasks={completedTasks} setCompletedTasks={setCompletedTasks} />
          ) : view === "clients" ? (
            <ClientsPage onClient={setSelectedClient} />
          ) : view === "domains" ? (
            <DomainsPage />
          ) : view === "websites" ? (
            <WebsitesPage />
          ) : view === "renewals" ? (
            <RenewalsPage />
          ) : view === "projects" ? (
            <ProjectsPage />
          ) : (
            <SettingsPage setToast={setToast} />
          )}
        </div>
      </main>

      {searchOpen && (
        <div className="search-overlay" role="dialog" aria-modal="true" aria-label="Global search" onMouseDown={(event) => event.target === event.currentTarget && setSearchOpen(false)}>
          <div className="command-panel">
            <div className="command-input"><span>⌕</span><input ref={searchRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search clients, domains, contacts, projects…" aria-label="Search everything" /><kbd>ESC</kbd></div>
            <p className="result-label">{query ? `${searchResults.length} results` : "Recent & suggested"}</p>
            <div className="search-results">
              {searchResults.length ? searchResults.map((item, index) => (
                <button key={`${item.type}-${item.title}`} onClick={() => openSearchResult(item)}>
                  <span className="result-icon">{item.type.charAt(0)}</span>
                  <span><strong>{item.title}</strong><small>{item.detail}</small></span>
                  <em>{item.type}</em>{index === 0 && <kbd>↵</kbd>}
                </button>
              )) : <div className="empty-search">No records found for “{query}”</div>}
            </div>
            <div className="command-footer"><span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span><span><kbd>↵</kbd> Open</span><span><kbd>esc</kbd> Close</span><b>Searches everything in EXA</b></div>
          </div>
        </div>
      )}

      {toast && <div className="toast" role="status"><span>✓</span>{toast}</div>}
    </div>
  );
}

function PageTitle({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description: string; action?: string }) {
  return (
    <div className="page-title">
      <div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h1>{title}</h1><p>{description}</p></div>
      {action && <button className="primary-action">＋ {action}</button>}
    </div>
  );
}

function Dashboard({ onView, onClient, completedTasks, setCompletedTasks }: { onView: (view: View) => void; onClient: (client: (typeof clients)[number]) => void; completedTasks: number[]; setCompletedTasks: (tasks: number[]) => void }) {
  const toggleTask = (index: number) => setCompletedTasks(completedTasks.includes(index) ? completedTasks.filter((item) => item !== index) : [...completedTasks, index]);
  return (
    <>
      <section className="welcome">
        <div><span className="eyebrow">Monday, 20 July</span><h1>Good morning, Ben.</h1><p>Here’s what needs your attention across Hayes Communications.</p></div>
        <div className="day-chip"><span className="live-dot" />Quiet morning <strong>4 tasks today</strong></div>
      </section>

      <section className="metrics-grid">
        <button className="metric-card" onClick={() => onView("clients")}><span>Active clients</span><strong>12</strong><small><b>↑ 2</b> this quarter</small><i>View clients ↗</i></button>
        <button className="metric-card" onClick={() => onView("projects")}><span>Open projects</span><strong>3</strong><small>2 on track · <b className="amber">1 at risk</b></small><i>View projects ↗</i></button>
        <button className="metric-card revenue-card" onClick={() => onView("clients")}><span>Monthly revenue</span><strong>$18.4k</strong><small><b>↑ 8.2%</b> vs last month</small><MiniChart /></button>
        <button className="metric-card renew-card" onClick={() => onView("renewals")}><span>Renewals due</span><strong>2</strong><small>Within the next 30 days</small><i>Review renewals ↗</i></button>
      </section>

      <section className="dashboard-grid">
        <article className="panel tasks-panel">
          <div className="panel-head"><div><span className="eyebrow">Monday</span><h2>Today’s tasks</h2></div><button onClick={() => onView("projects")}>View all <span>↗</span></button></div>
          <div className="task-list">
            {tasks.map((task, index) => {
              const done = completedTasks.includes(index);
              return <div className={`task-row ${done ? "done" : ""}`} key={task.title}>
                <button className="task-check" aria-label={`${done ? "Mark incomplete" : "Complete"} ${task.title}`} aria-pressed={done} onClick={() => toggleTask(index)}>{done ? "✓" : ""}</button>
                <div className="task-copy"><strong>{task.title}</strong><span>{task.meta}</span></div>
                {task.priority === "High" && <em>Priority</em>}<time>{task.time}</time>
              </div>;
            })}
          </div>
          <button className="add-row">＋ Add a task</button>
        </article>

        <article className="panel renewals-panel">
          <div className="panel-head"><div><span className="eyebrow">Next 30 days</span><h2>Renewals</h2></div><button onClick={() => onView("renewals")}>View all <span>↗</span></button></div>
          <div className="renewal-feature">
            <div className="renewal-date"><strong>08</strong><span>AUG</span></div>
            <div><h3>fieldhouse.com.au</h3><p>Field House · GoDaddy</p><span className="warning-pill">19 days remaining</span></div>
          </div>
          <div className="renewal-small"><div className="renewal-date"><strong>26</strong><span>AUG</span></div><div><h3>southsidefoundation.org</h3><p>Southside Foundation · Namecheap</p></div><span>37d</span></div>
          <button className="review-button" onClick={() => onView("renewals")}>Review renewals <span>→</span></button>
        </article>

        <article className="panel health-panel">
          <div className="panel-head"><div><span className="eyebrow">Portfolio</span><h2>Client health</h2></div><button onClick={() => onView("clients")}>View all <span>↗</span></button></div>
          <div className="health-score">
            <div className="score-ring"><strong>86</strong><span>/100</span></div>
            <div><h3>Portfolio is healthy</h3><p>10 healthy · 1 attention · 1 at risk</p></div>
            <span className="trend">↑ 3 pts</span>
          </div>
          <div className="client-health-list">
            {clients.slice(0, 4).map((client) => <button key={client.name} onClick={() => onClient(client)}>
              <span className={`client-avatar ${client.tone}`}>{client.initials}</span>
              <span><strong>{client.name}</strong><small>{client.industry}</small></span>
              <i className={client.health < 80 ? "attention" : ""} style={{ "--score": `${client.health}%` } as React.CSSProperties}><b /></i>
              <em>{client.health}</em>
            </button>)}
          </div>
        </article>

        <article className="panel activity-panel">
          <div className="panel-head"><div><span className="eyebrow">Latest</span><h2>Recent activity</h2></div><button>View all <span>↗</span></button></div>
          <div className="activity-list">
            {activity.map((item) => <div key={item.text}><span>{item.icon}</span><p><strong>{item.text}</strong><small>{item.client}</small></p><time>{item.time}</time></div>)}
          </div>
          <div className="next-meeting"><span className="pulse" /><div><small>UP NEXT · 11:30 AM</small><strong>Field House weekly check-in</strong></div><button>Join ↗</button></div>
        </article>
      </section>
    </>
  );
}

function ClientsPage({ onClient }: { onClient: (client: (typeof clients)[number]) => void }) {
  return (
    <>
      <PageTitle title="Clients" description="Every relationship, resource and signal in one place." action="Add client" />
      <div className="filter-bar"><button className="active">All clients <span>12</span></button><button>Healthy <span>10</span></button><button>Needs attention <span>2</span></button><div /><button>↕ Sort: Health</button><button>☷ Filter</button></div>
      <div className="client-cards">
        {clients.map((client) => <button className="client-card" key={client.name} onClick={() => onClient(client)}>
          <div className="client-card-top"><span className={`client-avatar large ${client.tone}`}>{client.initials}</span><span className={`status-badge ${client.health < 70 ? "risk" : client.health < 80 ? "warn" : ""}`}><i />{client.status}</span></div>
          <h2>{client.name}</h2><p>{client.industry}</p>
          <div className="client-card-meta"><span><small>WEBSITE</small><strong>{client.domain}</strong></span><span><small>PLATFORM</small><strong>{client.website}</strong></span></div>
          <div className="client-card-bottom"><span><small>HEALTH</small><b>{client.health}</b><i><em style={{ width: `${client.health}%` }} /></i></span><strong>Open client <b>→</b></strong></div>
        </button>)}
      </div>
    </>
  );
}

function DomainsPage() {
  return (
    <>
      <PageTitle title="Domains" description="Expiry, registrar, DNS and SSL status across every client." action="Add domain" />
      <div className="summary-strip"><span><small>Total domains</small><strong>17</strong></span><span><small>Expiring in 30 days</small><strong className="amber-text">2</strong></span><span><small>Auto-renew enabled</small><strong>15</strong></span><span><small>SSL healthy</small><strong className="lime-text">17</strong></span></div>
      <div className="data-panel">
        <div className="table-head"><span>Domain</span><span>Client</span><span>Registrar</span><span>Expiry</span><span>Auto-renew</span><span>SSL</span></div>
        {domains.map((domain) => <div className="table-row" key={domain.name}><span><strong>{domain.name}</strong><small>DNS · Cloudflare</small></span><span>{domain.client}</span><span>{domain.registrar}</span><span><strong>{domain.expiry}</strong><small className={domain.days < 30 ? "amber-text" : ""}>{domain.days} days</small></span><span><i className={`toggle ${domain.renew ? "on" : ""}`} /></span><span><b className="status-dot" />{domain.ssl}</span></div>)}
      </div>
    </>
  );
}

function WebsitesPage() {
  return (
    <>
      <PageTitle title="Websites" description="Production, staging and platform access without the scavenger hunt." action="Add website" />
      <div className="website-grid">
        {clients.map((client) => <article className="website-card" key={client.name}>
          <div className="browser-bar"><i /><i /><i /><span>{client.domain}</span></div>
          <div className="site-preview"><BrandMark /><span>{client.initials}</span></div>
          <div className="website-body"><div><span className="status-badge"><i />Live</span><h2>{client.name}</h2><p>{client.domain}</p></div><button aria-label={`Open ${client.name} website`}>↗</button></div>
          <div className="website-meta"><span><small>PLATFORM</small><strong>{client.website}</strong></span><span><small>LAST CHECK</small><strong>4 min ago</strong></span></div>
        </article>)}
      </div>
    </>
  );
}

function RenewalsPage() {
  return (
    <>
      <PageTitle title="Renewals" description="See what is due before it becomes urgent." />
      <section className="renewal-hero"><div><span className="eyebrow">Next 90 days</span><h2>Two renewals need attention</h2><p>$274 in expected renewal costs across domains and subscriptions.</p></div><div className="renewal-ring"><strong>2</strong><span>due soon</span></div></section>
      <div className="timeline">
        {domains.slice(0, 4).map((domain, index) => <div className="timeline-row" key={domain.name}><div className="timeline-date"><span>{domain.expiry.split(" ")[0]}</span><strong>{domain.expiry.split(" ")[1].toUpperCase()}</strong><i /></div><div className="timeline-card"><div><span className="eyebrow">{index < 2 ? "Action required" : "Upcoming"}</span><h3>{domain.name}</h3><p>{domain.client} · Domain renewal via {domain.registrar}</p></div><span className={domain.days < 30 ? "warning-pill" : "quiet-pill"}>{domain.days} days</span><strong>{index === 0 ? "$39" : index === 1 ? "$27" : "$24"}</strong><button>Review →</button></div></div>)}
      </div>
    </>
  );
}

function ProjectsPage() {
  return (
    <>
      <PageTitle title="Projects" description="A clear operational view now, ready for Asana sync later." action="New project" />
      <div className="project-board">
        {["Planned", "In progress", "Complete"].map((column) => <section key={column}><div className="board-head"><span><i className={column === "In progress" ? "lime" : ""} />{column}</span><em>{projects.filter((project) => column === "Complete" ? project.status === "Complete" : column === "Planned" ? project.status === "Planned" : ["In progress", "At risk"].includes(project.status)).length}</em><button>＋</button></div>
          {projects.filter((project) => column === "Complete" ? project.status === "Complete" : column === "Planned" ? project.status === "Planned" : ["In progress", "At risk"].includes(project.status)).map((project) => <article className="project-card" key={project.name}>
            <span className={`project-status ${project.status === "At risk" ? "risk" : ""}`}>{project.status}</span><h3>{project.name}</h3><p>{project.client}</p>
            <div className="progress-label"><span>Progress</span><strong>{project.progress}%</strong></div><div className="progress-bar"><i style={{ width: `${project.progress}%` }} /></div>
            <footer><span>◷ {project.due}</span><span className="tiny-avatar">{project.owner.slice(0, 1)}</span></footer>
          </article>)}
        </section>)}
      </div>
    </>
  );
}

function ClientDetail({ client, onBack, setToast }: { client: (typeof clients)[number]; onBack: () => void; setToast: (message: string) => void }) {
  const tabs = ["Overview", "Contacts", "Projects", "Domains", "Websites", "Subscriptions", "Support", "Notes", "Activity"];
  const [tab, setTab] = useState("Overview");
  return (
    <>
      <button className="back-link" onClick={onBack}>← All clients</button>
      <section className="client-hero">
        <span className={`client-avatar hero-avatar ${client.tone}`}>{client.initials}</span>
        <div><span className="eyebrow">{client.industry}</span><h1>{client.name}</h1><p>{client.domain} · Client since March 2023</p></div>
        <div className="hero-health"><span>Health score</span><strong>{client.health}<small>/100</small></strong><em className={client.health < 80 ? "warn" : ""}><i />{client.status}</em></div>
        <button className="primary-action">Edit client</button>
      </section>
      <div className="tabs" role="tablist" aria-label="Client sections">{tabs.map((item) => <button role="tab" aria-selected={tab === item} className={tab === item ? "active" : ""} key={item} onClick={() => setTab(item)}>{item}</button>)}</div>
      {tab === "Overview" ? <>
        <section className="quick-launch">
          <div className="panel-head"><div><span className="eyebrow">One click away</span><h2>Quick launch</h2></div><span className="helper">Credentials open in 1Password—never stored in EXA.</span></div>
          <div className="launch-grid">{launchLinks.map(([label, icon, href]) => <a key={label} href={href} target="_blank" rel="noreferrer" onClick={() => setToast(`Opening ${label}`)}><span>{icon}</span><strong>{label}</strong><em>↗</em></a>)}</div>
        </section>
        <section className="client-detail-grid">
          <article className="panel detail-panel"><div className="panel-head"><div><span className="eyebrow">At a glance</span><h2>Overview</h2></div><button>Edit</button></div><dl><div><dt>Primary contact</dt><dd>{client.contact}<small>{client.email}</small></dd></div><div><dt>Monthly revenue</dt><dd>{client.revenue}</dd></div><div><dt>Website platform</dt><dd>{client.website}</dd></div><div><dt>Account owner</dt><dd>Ben Hayes</dd></div><div><dt>Workspace</dt><dd><span className="status-dot" />Active</dd></div><div><dt>Invoices</dt><dd><span className="status-dot" />Current</dd></div></dl></article>
          <article className="panel detail-panel"><div className="panel-head"><div><span className="eyebrow">Active work</span><h2>Projects</h2></div><button>View all ↗</button></div><div className="feature-project"><span className="project-status">In progress</span><h3>{client.project}</h3><p>Due 29 July · Updated 18 minutes ago</p><div className="progress-label"><span>Progress</span><strong>68%</strong></div><div className="progress-bar"><i style={{ width: "68%" }} /></div></div><button className="add-row">＋ Add project</button></article>
          <article className="panel detail-panel support-preview"><div className="panel-head"><div><span className="eyebrow">Latest</span><h2>Support history</h2></div><button>Log interaction</button></div>{activity.slice(0, 3).map((item) => <div key={item.text}><span>{item.icon}</span><p><strong>{item.text}</strong><small>{item.time} · Ben Hayes</small></p></div>)}</article>
          <article className="panel detail-panel note-preview"><div className="panel-head"><div><span className="eyebrow">Pinned</span><h2>Notes</h2></div><button>Edit</button></div><p>Prefers concise weekly updates on Fridays. Route all website content approvals through {client.contact.split(" ")[0]}.</p><span>Last updated 8 July by Ben</span></article>
        </section>
      </> : <EmptySection tab={tab} client={client.name} />}
    </>
  );
}

function EmptySection({ tab, client }: { tab: string; client: string }) {
  return <section className="empty-section"><span>{tab.charAt(0)}</span><h2>{tab}</h2><p>{client}’s {tab.toLowerCase()} will appear here. This section is ready for connected operational data.</p><button className="primary-action">＋ Add {tab.replace(/s$/, "").toLowerCase()}</button></section>;
}

function SettingsPage({ setToast }: { setToast: (message: string) => void }) {
  return (
    <>
      <PageTitle title="Settings" description="Configure EXA for Hayes Communications." />
      <div className="settings-layout">
        <aside><button className="active">General</button><button>Integrations</button><button>Notifications</button><button>Security</button><button>Team</button></aside>
        <section className="panel settings-panel"><div><h2>Workspace</h2><p>Basic details for your EXA workspace.</p></div><label>Workspace name<input defaultValue="Hayes Communications" /></label><label>Workspace URL<div className="input-prefix"><span>exa.hayescomms.com/</span><input defaultValue="workspace" /></div></label><label>Timezone<select defaultValue="hobart"><option value="hobart">Australia/Hobart (AEST)</option><option value="sydney">Australia/Sydney (AEST)</option></select></label><hr /><div><h2>Appearance</h2><p>EXA is dark-first. A light theme can be added later.</p></div><div className="theme-choice"><button className="selected"><i className="theme-dark" /><span><strong>Dark</strong><small>Selected</small></span></button><button disabled><i className="theme-light" /><span><strong>Light</strong><small>Coming later</small></span></button></div><footer><button onClick={() => setToast("Workspace settings saved")}>Save changes</button></footer></section>
      </div>
    </>
  );
}
