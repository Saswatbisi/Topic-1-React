'use client';

import { useEffect, useState } from 'react';
import { useToggle } from '../hooks/useToggle';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function Home() {
  const [theme, setTheme] = useLocalStorage<'light' | 'midnight' | 'sunset' | 'forest'>('theme-preference', 'light');
  const [sidebarOpen, toggleSidebar] = useToggle(true);
  const [advancedMode, toggleAdvanced] = useToggle(false);
  const [userName, setUserName] = useLocalStorage<string>('user-name', 'Developer Saswat');
  
  const [logHistory, setLogHistory] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogHistory((prev) => [`[${timestamp}] ${message}`, ...prev.slice(0, 7)]);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    addLog(`Theme updated to: "${theme}" (State persistent in localStorage)`);
  }, [theme]);

  const handleToggleSidebar = () => {
    toggleSidebar();
    addLog(`Sidebar state toggled to: ${!sidebarOpen}`);
  };

  const handleToggleAdvanced = () => {
    toggleAdvanced();
    addLog(`Advanced analytics state toggled to: ${!advancedMode}`);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', transition: 'var(--transition-smooth)' }}>
      {/* Sidebar Section */}
      <aside style={{
        width: sidebarOpen ? '280px' : '80px',
        backgroundColor: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-color)',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        transition: 'var(--transition-smooth)',
        overflow: 'hidden',
        whiteSpace: 'nowrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', height: '40px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            fontFamily: 'var(--font-display)'
          }}>
            ⚛️
          </div>
          {sidebarOpen && <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>Topic 1 React</h2>}
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1 }}>
          <div style={{
            padding: '12px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontWeight: 600,
            cursor: 'pointer'
          }}>
            📊 <span>{sidebarOpen ? 'Dashboard' : ''}</span>
          </div>
          <div style={{
            padding: '12px',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer'
          }} onClick={() => addLog('Navigation item clicked')}>
            🛠️ <span>{sidebarOpen ? 'Simulators' : ''}</span>
          </div>
          <div style={{
            padding: '12px',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer'
          }} onClick={() => addLog('Settings clicked')}>
            ⚙️ <span>{sidebarOpen ? 'Settings' : ''}</span>
          </div>
        </nav>

        <button className="btn btn-outline" onClick={handleToggleSidebar} style={{ justifyContent: 'center' }}>
          {sidebarOpen ? '◀ Collapse Sidebar' : '▶'}
        </button>
      </aside>

      {/* Main Content Area */}
      <main style={{ flexGrow: 1, padding: '40px', overflowY: 'auto' }}>
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '40px',
          paddingBottom: '20px',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <div>
            <h1 style={{ fontSize: '2.25rem', color: 'var(--text-primary)', marginBottom: '4px' }}>Custom Hooks Sandbox</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Extracting, Composing and Sharing Stateful Logic in React</p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Welcome back,</span>
            <input 
              type="text" 
              value={userName} 
              onChange={handleNameChange}
              style={{
                fontFamily: 'var(--font-sans)',
                fontWeight: 600,
                fontSize: '0.95rem',
                color: 'var(--text-primary)',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                padding: '6px 12px',
                outline: 'none',
                width: '160px',
                textAlign: 'center'
              }}
              placeholder="Enter name..."
            />
          </div>
        </header>

        {/* Dashboard Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          
          {/* Theme Switcher Card */}
          <section className="card pulse-glow" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '8px' }}>🎨 Theme Preference</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Uses custom hook `useLocalStorage` to persist your visual style selection.</p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <button 
                className="theme-pill" 
                data-active={theme === 'light'} 
                onClick={() => setTheme('light')}
                style={{ backgroundColor: '#ffffff', color: '#0f172a', border: '1px solid #cbd5e1' }}
              >
                ☀️ Light Mode
              </button>
              <button 
                className="theme-pill" 
                data-active={theme === 'midnight'} 
                onClick={() => setTheme('midnight')}
                style={{ backgroundColor: '#1e293b', color: '#f8fafc', border: '1px solid #334155' }}
              >
                🌌 Midnight
              </button>
              <button 
                className="theme-pill" 
                data-active={theme === 'sunset'} 
                onClick={() => setTheme('sunset')}
                style={{ backgroundColor: '#ffedd5', color: '#c2410c', border: '1px solid #fed7aa' }}
              >
                🌇 Sunset
              </button>
              <button 
                className="theme-pill" 
                data-active={theme === 'forest'} 
                onClick={() => setTheme('forest')}
                style={{ backgroundColor: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0' }}
              >
                🌿 Forest
              </button>
            </div>
            
            <div style={{ 
              backgroundColor: 'var(--bg-app)', 
              borderRadius: 'var(--radius-sm)', 
              padding: '12px', 
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-color)'
            }}>
              <strong>Raw State value:</strong> <code>"{theme}"</code>
            </div>
          </section>

          {/* Feature Toggles Card */}
          <section className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '8px' }}>⚙️ Feature Flags</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Uses custom hook `useToggle` for UI switches and layout expansion.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 500 }}>Advanced Mode Analytics</span>
                <button 
                  className={`btn ${advancedMode ? 'btn-primary' : 'btn-outline'}`}
                  onClick={handleToggleAdvanced}
                  style={{ padding: '6px 14px', fontSize: '0.85rem' }}
                >
                  {advancedMode ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 500 }}>Navigation Sidebar</span>
                <button 
                  className={`btn ${sidebarOpen ? 'btn-primary' : 'btn-outline'}`}
                  onClick={handleToggleSidebar}
                  style={{ padding: '6px 14px', fontSize: '0.85rem' }}
                >
                  {sidebarOpen ? 'SHOWN' : 'HIDDEN'}
                </button>
              </div>
            </div>

            {advancedMode && (
              <div style={{
                marginTop: '10px',
                padding: '16px',
                backgroundColor: 'var(--primary-light)',
                borderRadius: 'var(--radius-sm)',
                border: '1px dashed var(--primary)',
                animation: 'fadeIn 0.3s ease-out'
              }}>
                <h4 style={{ color: 'var(--primary)', marginBottom: '6px', fontSize: '0.95rem' }}>🚀 Premium Insights</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Active themes generate visual telemetry. Persistent state checks are fully active.</p>
              </div>
            )}
          </section>

          {/* Real-time State Inspector & Terminal Simulator */}
          <section className="card" style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>🖥️ Live Hook State Inspector & Logs</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div>
                <h4 style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>State Serialization</h4>
                <pre style={{
                  backgroundColor: 'var(--bg-app)',
                  padding: '16px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontSize: '0.8rem',
                  fontFamily: 'monospace',
                  overflowX: 'auto'
                }}>
{JSON.stringify({
  localStorage: {
    'theme-preference': theme,
    'user-name': userName
  },
  memoryState: {
    sidebarOpen,
    advancedMode
  }
}, null, 2)}
                </pre>
              </div>

              <div>
                <h4 style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Action Log History</h4>
                <div style={{
                  backgroundColor: '#090d16',
                  color: '#10b981',
                  fontFamily: 'monospace',
                  padding: '16px',
                  borderRadius: 'var(--radius-sm)',
                  minHeight: '140px',
                  fontSize: '0.8rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)',
                  border: '1px solid #1f2937'
                }}>
                  {logHistory.length === 0 ? (
                    <span style={{ color: '#6b7280' }}>Waiting for actions... Select a theme or toggle features above!</span>
                  ) : (
                    logHistory.map((log, index) => (
                      <div key={index} style={{ wordBreak: 'break-all' }}>{log}</div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
