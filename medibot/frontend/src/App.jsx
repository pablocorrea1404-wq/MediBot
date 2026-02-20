import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard.jsx';
import Login from './components/Login.jsx';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        console.log("Checking auth token...");
        const token = localStorage.getItem('medibot_token');
        if (token) {
            console.log("Token found, authenticating...");
            setIsAuthenticated(true);
        }
    }, []);

    const logout = () => {
        localStorage.removeItem('medibot_token');
        setIsAuthenticated(false);
    };

    console.log("App Rendering - Authenticated:", isAuthenticated);

    return (
        <div className="App">
            {isAuthenticated ? (
                <Dashboard onLogout={logout} />
            ) : (
                <Login onLogin={() => setIsAuthenticated(true)} />
            )}
        </div>
    );
}

export default App;
