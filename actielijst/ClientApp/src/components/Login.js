import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Simpele hardcoded gebruikers voor demo
    const users = [
        { username: 'jan', password: 'jan123' },
        { username: 'piet', password: 'piet123' }
    ];

    const handleSubmit = (event) => {
        event.preventDefault();
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            onLogin(user.username); // Geef gebruikersnaam door aan App.js
            setError('');
        } else {
            setError('Ongeldige gebruikersnaam of wachtwoord');
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
            <h2>Inloggen</h2>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Gebruikersnaam"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Wachtwoord"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Inloggen
                </Button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </div>
    );
}

export default Login;