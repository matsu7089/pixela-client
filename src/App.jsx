import { useState, useEffect } from 'react';
import UserAuth from './components/UserAuth';
import GraphManager from './components/GraphManager';
import StudyRecorder from './components/StudyRecorder';
import './App.css';

function App() {
  const [username, setUsername] = useState(() => localStorage.getItem('pixela_username') || '');
  const [token, setToken] = useState(() => localStorage.getItem('pixela_token') || '');
  const [graphId, setGraphId] = useState(() => localStorage.getItem('pixela_graph_id') || '');
  const [inputGraphId, setInputGraphId] = useState('');
  const [savedGraphs, setSavedGraphs] = useState(() => {
    const saved = localStorage.getItem('pixela_saved_graphs');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('pixela_username', username);
  }, [username]);

  useEffect(() => {
    localStorage.setItem('pixela_token', token);
  }, [token]);

  useEffect(() => {
    localStorage.setItem('pixela_graph_id', graphId);
  }, [graphId]);

  useEffect(() => {
    localStorage.setItem('pixela_saved_graphs', JSON.stringify(savedGraphs));
  }, [savedGraphs]);

  const addGraphToHistory = (id) => {
    if (id && !savedGraphs.includes(id)) {
      setSavedGraphs(prev => [...prev, id]);
    }
  };

  const removeGraphFromHistory = (id) => {
    setSavedGraphs(prev => prev.filter(g => g !== id));
  };

  const selectGraph = (id) => {
    setGraphId(id);
    addGraphToHistory(id);
  }

  const handleLogin = (user, userToken) => {
    setUsername(user);
    setToken(userToken);
  };

  const handleLogout = () => {
    setUsername('');
    setToken('');
    setGraphId('');
    setInputGraphId('');
    localStorage.removeItem('pixela_username');
    localStorage.removeItem('pixela_token');
    localStorage.removeItem('pixela_graph_id');
  };

  const isLoggedIn = username && token;

  return (
    <div className="container">
      <header>
        <h1>Pixela Client</h1>
        {isLoggedIn && (
          <div className="user-info">
            <span>Logged in as: <strong>{username}</strong></span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        )}
      </header>

      <main>
        {!isLoggedIn ? (
          <UserAuth onLogin={handleLogin} />
        ) : (
          <>
            {!graphId ? (
              <div className="card">
                <h2>Select or Create Graph</h2>
                <p>You need a graph ID to record your study time.</p>
                <div className="form-group">
                  <label>Enter existing Graph ID:</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                      value={inputGraphId}
                      onChange={(e) => setInputGraphId(e.target.value)}
                      placeholder="e.g. study-log"
                    />
                    <button onClick={() => selectGraph(inputGraphId)}>Set</button>
                  </div>
                </div>

                {savedGraphs.length > 0 && (
                  <div style={{ marginTop: '20px' }}>
                    <h3>Saved Graphs</h3>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      {savedGraphs.map(id => (
                        <li key={id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', padding: '8px', background: '#333', borderRadius: '4px' }}>
                          <span>{id}</span>
                          <div style={{ gap: '8px', display: 'flex' }}>
                            <button className="secondary" style={{ padding: '4px 8px', fontSize: '0.9em' }} onClick={() => selectGraph(id)}>Select</button>
                            <button className="secondary" style={{ padding: '4px 8px', fontSize: '0.9em', borderColor: '#ff4444', color: '#ff4444' }} onClick={() => removeGraphFromHistory(id)}>Delete</button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <hr style={{ margin: '20px 0', border: '0', borderTop: '1px solid #444' }} />
                <p>Or create a new one:</p>
                <GraphManager
                  username={username}
                  token={token}
                  onGraphCreated={(id) => selectGraph(id)}
                />
              </div>
            ) : (
              <>
                <StudyRecorder
                  username={username}
                  token={token}
                  graphId={graphId}
                />

                <div style={{ textAlign: 'right', marginTop: '1rem' }}>
                  <button className="secondary" onClick={() => setGraphId('')}>Change Graph ID</button>
                </div>

                <details style={{ marginTop: '2rem' }}>
                  <summary>Create New Graph</summary>
                  <GraphManager
                    username={username}
                    token={token}
                    onGraphCreated={(id) => selectGraph(id)}
                  />
                </details>
              </>
            )}
          </>
        )}
      </main>
    </div >
  );
}

export default App;
