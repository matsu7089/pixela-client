import { useState, useEffect } from 'react';
import UserAuth from './components/UserAuth';
import GraphManager from './components/GraphManager';
import StudyRecorder from './components/StudyRecorder';
import './App.css';

function App() {
    const [username, setUsername] = useState('');
    const [token, setToken] = useState('');
    // Simple state machine: 'login' | 'dashboard'
    const [view, setView] = useState<'login' | 'dashboard'>('login');

    // We can track the active graph ID. 
    // For simplicity MVP: we just let user type it or set default.
    // Ideally we would fetch it.
    const [graphId, setGraphId] = useState('study-log');

    useEffect(() => {
        // Load from local storage on mount
        const savedUser = localStorage.getItem('pixela_username');
        const savedToken = localStorage.getItem('pixela_token');
        if (savedUser && savedToken) {
            setUsername(savedUser);
            setToken(savedToken);
            setView('dashboard');
        }
    }, []);

    const handleLogin = (u: string, t: string) => {
        setUsername(u);
        setToken(t);
        localStorage.setItem('pixela_username', u);
        localStorage.setItem('pixela_token', t);
        setView('dashboard');
    };

    const handleLogout = () => {
        setUsername('');
        setToken('');
        localStorage.removeItem('pixela_username');
        localStorage.removeItem('pixela_token');
        setView('login');
    };

    return (
        <div className="container">
            <header>
                <h1>Pixela Study Tracker</h1>
                {view === 'dashboard' && (
                    <div className="user-info">
                        <span>Hello, {username}</span>
                        <button onClick={handleLogout} className="logout-btn">Logout</button>
                    </div>
                )}
            </header>

            <main>
                {view === 'login' && <UserAuth onLogin={handleLogin} />}

                {view === 'dashboard' && (
                    <div className="dashboard">
                        <div className="section">
                            <StudyRecorder username={username} token={token} graphId={graphId} />
                        </div>
                        <div className="section">
                            <details>
                                <summary>Create New Graph / Settings</summary>
                                <GraphManager
                                    username={username}
                                    token={token}
                                    onGraphCreated={(id) => setGraphId(id)}
                                />
                                <div className="graph-selector" style={{ marginTop: '1rem' }}>
                                    <label>Active Graph ID: </label>
                                    <input value={graphId} onChange={e => setGraphId(e.target.value)} />
                                </div>
                            </details>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;
