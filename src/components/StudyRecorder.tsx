import React, { useState } from 'react';
import { postPixel, getGraphUrl } from '../services/api';

interface StudyRecorderProps {
    username: string;
    token: string;
    graphId: string;
}

const StudyRecorder: React.FC<StudyRecorderProps> = ({ username, token, graphId }) => {
    const [date, setDate] = useState(() => {
        const now = new Date();
        return now.toISOString().slice(0, 10).replace(/-/g, '');
    });
    const [quantity, setQuantity] = useState('');
    const [message, setMessage] = useState('');
    // Force iframe refresh by updating key
    const [refreshKey, setRefreshKey] = useState(0);

    const handleRecord = async () => {
        try {
            await postPixel({
                username,
                token,
                graphId,
                date,
                quantity,
            });
            setMessage('Recorded successfully!');
            setRefreshKey(prev => prev + 1);
        } catch (error: any) {
            setMessage(`Error: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div className="card">
            <h2>Graph ID: {graphId}</h2>
            <div className="form-group">
                <label>Date (YYYYMMDD):</label>
                <input value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Quantity:</label>
                <input value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="e.g. 60" />
            </div>
            <button onClick={handleRecord}>Record</button>
            {message && <p className="message">{message}</p>}

            <div className="graph-view">
                <h3>Current Graph</h3>
                <iframe
                    key={refreshKey}
                    src={`${getGraphUrl(username, graphId)}.html?mode=simple`}
                    title="Pixela Graph"
                    width="100%"
                    height="160"
                    style={{ border: 'none' }}
                />
                <div style={{ marginTop: '10px' }}>
                    <a href={getGraphUrl(username, graphId)} target="_blank" rel="noopener noreferrer">View Full Graph on Pixe.la</a>
                </div>
            </div>
        </div>
    );
};

export default StudyRecorder;
