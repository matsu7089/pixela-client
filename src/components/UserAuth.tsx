import React, { useState } from 'react';
import { createUser } from '../services/api';

interface UserAuthProps {
    onLogin: (username: string, token: string) => void;
}

const UserAuth: React.FC<UserAuthProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [token, setToken] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [message, setMessage] = useState('');

    const handleRegister = async () => {
        try {
            await createUser({
                username,
                token,
                agreeTermsOfService: 'yes',
                notMinor: 'yes',
            });
            setMessage('User created successfully! You can now login.');
            setIsRegistering(false);
        } catch (error: any) {
            setMessage(`Error: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleLogin = () => {
        if (username && token) {
            onLogin(username, token);
        } else {
            setMessage('Please enter both username and token.');
        }
    };

    return (
        <div className="card">
            <h2>{isRegistering ? 'Create New User' : 'Login'}</h2>
            <div className="form-group">
                <label>Username:</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                />
            </div>
            <div className="form-group">
                <label>Token:</label>
                <input
                    type="password"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Enter token (min 8 chars)"
                />
            </div>

            {isRegistering ? (
                <>
                    <p className="note">By registering, you agree to the Terms of Service and certify you are not a minor.</p>
                    <div className="actions">
                        <button onClick={handleRegister}>Create User</button>
                        <button className="secondary" onClick={() => setIsRegistering(false)}>Cancel</button>
                    </div>
                </>
            ) : (
                <div className="actions">
                    <button onClick={handleLogin}>Login</button>
                    <button className="secondary" onClick={() => setIsRegistering(true)}>Register New User</button>
                </div>
            )}

            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default UserAuth;
