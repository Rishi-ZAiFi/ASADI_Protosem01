import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      {/* Left Sidebar - Navigation & Agents */}
      <aside className={styles.sidebar}>
        <div style={{ fontWeight: 600, fontSize: "1.1rem", marginBottom: "2rem" }}>
          Writer's Room.
        </div>
        
        <button className={styles.button}>+ New Reel Series</button>
        
        <div className={styles.navSection}>
          <div className={styles.navTitle}>Your Universe</div>
          <div className={styles.navItem}>Characters</div>
          <div className={styles.navItem}>Locations</div>
          <div className={styles.navItem}>Timeline & Canon</div>
        </div>

        <div className={styles.navSection}>
          <div className={styles.navTitle}>Active Agents</div>
          <div className={styles.navItem}>● Orchestrator</div>
          <div className={styles.navItem}>● Continuity Critic</div>
          <div className={styles.navItem}>● Reel Structurer</div>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <main className={styles.mainContent}>
        <header className={styles.header}>
          Episode 07: The Library Incident
        </header>
        
        <div className={styles.editorArea}>
          <div className={styles.document}>
            <h1 className={styles.title}>The Library Incident</h1>
            <p className={styles.subtitle}>Last edited just now • Continuity Validated</p>
            
            <div className={styles.placeholderText}>
              <p style={{ marginBottom: '1rem', fontStyle: 'italic', color: 'var(--text-muted)' }}>
                [SCENE START - EXT. COLLEGE LIBRARY - DAY]
              </p>
              <p style={{ marginBottom: '1rem' }}>
                The AI Writer's Room is currently booting up. Your multi-agent system is preparing to load canonical memories, character profiles, and emotional arcs to generate the next scene perfectly.
              </p>
              <p>
                To begin, connect your LLM provider by adding your API key to the .env file in the root directory.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
