import React, { useState } from 'react';
import ActieForm from './components/ActieForm';
import ActieLijst from './components/ActieLijst';
import Login from './components/Login';

function App() {
    const [currentUser, setCurrentUser] = useState(null); // Ingelogde gebruiker
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [selectedAction, setSelectedAction] = useState(null);

    const handleLogin = (username) => {
        setCurrentUser(username); // Zet de ingelogde gebruiker
    };

    const handleActionAdded = () => {
        setRefreshTrigger(prev => prev + 1);
        setSelectedAction(null);
    };

    const handleEditAction = (action) => {
        setSelectedAction(action);
    };

    if (!currentUser) {
        return <Login onLogin={handleLogin} />;
    }

    return (
        <div className="App" style={{ padding: '20px' }}>
            <h1>Actielijst (Ingelogd als: {currentUser})</h1>
            <ActieForm initialAction={selectedAction} onActionAdded={handleActionAdded} currentUser={currentUser} />
            <h2>Mijn Acties</h2>
            <ActieLijst userId={currentUser} refreshTrigger={refreshTrigger} onEditAction={handleEditAction} />
        </div>
    );
}

export default App;