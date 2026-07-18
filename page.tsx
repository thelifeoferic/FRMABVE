import Link from "next/link";

const capabilities = [
  ["01", "Brand intelligence", "Turn the way a brand thinks, speaks and serves into a system the whole team can use."],
  ["02", "Custom AI products", "Purpose-built tools that make complex work feel clear, useful and distinctly yours."],
  ["03", "Campaign systems", "Move from audience insight to on-brand creative without losing the human point of view."],
  ["04", "Operations automation", "Remove repetitive work so teams can spend more time on customers, craft and growth."]
];

export default function FromAboveHome() {
  return (
    <main className="fa-site">
      <header className="fa-nav">
        <Link className="fa-logo" href="/" aria-label="From Above home"><span>FRM</span><span>ABVE</span></Link>
        <nav aria-label="Primary navigation">
          <a href="#work">Work</a>
          <a href="#capabilities">Capabilities</a>
          <a href="#approach">Approach</a>
          <Link href="/asheville">Asheville Dispensary</Link>
          <Link href="/nest">The Nest</Link>
          <a href="https://hidesertexperiences.com" target="_blank" rel="noreferrer">HiDE</a>
        </nav>
        <Link className="fa-nav-cta" href="/asheville">Enter studio <span>↗</span></Link>
      </header>

      <section className="fa-hero">
        <p className="fa-kicker">AI MARKETING SOLUTIONS · ASHEVILLE / EVERYWHERE</p>
        <h1>Build the useful<br />version of <em>what’s next.</em></h1>
        <div className="fa-hero-foot"><p>From Above creates practical AI systems that turn brand knowledge into sharper campaigns, calmer operations and better customer experiences.</p><a href="#work" aria-label="Explore selected work">↓</a></div>
      </section>

      <section className="fa-intro" id="approach">
        <p className="fa-section-label">A DIFFERENT VANTAGE POINT</p>
        <div><h2>Technology should make the work feel <em>more human.</em></h2><p>We find the places where good ideas get slowed down, then design an intelligent system around the people already doing the work. Strategy, experience and automation—built as one thing.</p></div>
      </section>

      <section className="fa-work" id="work">
        <div className="fa-work-head"><p className="fa-section-label">SELECTED SYSTEMS</p><p>Two working prototypes. Two very different businesses. One idea: intelligence should feel native to the brand.</p></div>
        <article className="fa-case fa-case-asheville">
          <div className="fa-case-copy"><span>01 · CAMPAIGN INTELLIGENCE</span><h2>Asheville<br />Campaign Studio</h2><p>An AI campaign workspace that connects brand rules, audience strategy, product data and creative direction in one focused flow.</p><Link href="/asheville">Enter studio <b>↗</b></Link></div>
          <div className="fa-case-image"><span>ASHEVILLE, NC</span></div>
        </article>
        <article className="fa-case fa-case-nest">
          <div className="fa-case-copy"><span>02 · HOSPITALITY INTELLIGENCE</span><h2>The Nest<br /><em>by Hotel Wren</em></h2><p>A connected operating and guest-experience system for an intimate hi-desert hotel—designed to keep attention where it belongs: on the guest.</p><Link href="/nest">Enter The Nest <b>↗</b></Link></div>
          <div className="fa-case-image"><span>TWENTYNINE PALMS, CA</span></div>
        </article>
      </section>

      <section className="fa-capabilities" id="capabilities">
        <div className="fa-cap-head"><p className="fa-section-label">WHAT WE BUILD</p><h2>Strategy that<br />becomes a <em>system.</em></h2></div>
        <div className="fa-cap-list">{capabilities.map(([number, title, copy]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p><b>↗</b></article>)}</div>
      </section>

      <footer className="fa-footer"><p>FROM ABOVE · AI MARKETING SOLUTIONS</p><h2>See the whole thing.<br /><em>Build the right thing.</em></h2><div><span>Independent practice · 2026</span><a href="#work">Selected work ↑</a></div></footer>
    </main>
  );
}
