import React, { useState } from 'react';
import { createGraph } from '../services/api';

interface GraphManagerProps {
    username: string;
    token: string;
    onGraphCreated: (graphId: string) => void;
}

const GraphManager: React.FC<GraphManagerProps> = ({ username, token, onGraphCreated }) => {
    const [id, setId] = useState('study-log');
    const [name, setName] = useState('Study Time');
    const [unit, setUnit] = useState('minutes');
    const [type, setType] = useState<'int' | 'float'>('int');
    const [color, setColor] = useState<'shibafu' | 'momiji' | 'sora' | 'ichou' | 'ajisai' | 'kuro'>('shibafu'); // shibafu = green
    const [message, setMessage] = useState('');

    const handleCreate = async () => {
        try {
            await createGraph({
                username,
                token,
                id,
                name,
                unit,
                type,
                color,
            });
            setMessage('Graph created successfully!');
            onGraphCreated(id);
        } catch (error: any) {
            setMessage(`Error: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div className="card">
            <h2>Create New Graph</h2>
            <div className="form-group">
                <label>Graph ID:</label>
                <input value={id} onChange={(e) => setId(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Name:</label>
                <input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Unit:</label>
                <input value={unit} onChange={(e) => setUnit(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Type:</label>
                <select value={type} onChange={(e) => setType(e.target.value as 'int' | 'float')}>
                    <option value="int">Integer</option>
                    <option value="float">Float</option>
                </select>
            </div>
            <div className="form-group">
                <label>Color:</label>
                <select value={color} onChange={(e) => setColor(e.target.value as any)}>
                    <option value="shibafu">Shibafu (Green)</option>
                    <option value="momiji">Momiji (Red)</option>
                    <option value="sora">Sora (Blue)</option>
                    <option value="ichou">Ichou (Yellow)</option>
                    <option value="ajisai">Ajisai (Purple)</option>
                    <option value="kuro">Kuro (Black)</option>
                </select>
            </div>
            <button onClick={handleCreate}>Create Graph</button>
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default GraphManager;
