import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, IconButton, CircularProgress, Alert } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const API_URL = 'https://localhost:44361/api/actions';

function ActieLijst({ userId, refreshTrigger, onEditAction, onShowDetail, filterType, searchTerm }) {
    const [actions, setActions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchActions = async () => {
            setLoading(true);
            setError(null);
            try {
                const url = `${API_URL}/user/${userId}/${filterType}`;
                console.log(`Fetching actions from: ${url}`);
                const response = await axios.get(url);
                console.log('API response:', response.data);
                setActions(response.data);
            } catch (error) {
                const errorMsg = error.response?.data?.error || error.message;
                console.error('Fout bij ophalen acties:', errorMsg);
                setError(errorMsg);
            } finally {
                setLoading(false);
            }
        };
        fetchActions();
    }, [userId, refreshTrigger, filterType]);

    const handleEdit = (action) => {
        if (onEditAction) onEditAction(action);
    };

    const handleDelete = async (id) => {
        setError(null);
        try {
            await axios.delete(`${API_URL}/${id}`);
            console.log('Actie verwijderd:', id);
            const response = await axios.get(`${API_URL}/user/${userId}/${filterType}`);
            setActions(response.data);
        } catch (error) {
            const errorMsg = error.response?.data?.error || error.message;
            console.error('Fout bij verwijderen actie:', errorMsg);
            setError(errorMsg);
        }
    };

    const filteredActions = actions.filter(action =>
        [action.title, action.description, action.assignee, action.creator]
            .filter(Boolean)
            .some(field => field.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) {
        return <CircularProgress style={{ display: 'block', margin: '20px auto' }} />;
    }

    if (error) {
        return <Alert severity="error" style={{ margin: '20px' }}>{error}</Alert>;
    }

    return (
        <List>
            {filteredActions.length === 0 ? (
                <ListItem>
                    <ListItemText primary="Geen acties gevonden" />
                </ListItem>
            ) : (
                filteredActions.map((action) => (
                    <ListItem
                        key={action.id}
                        button // Maakt de ListItem klikbaar
                        onClick={() => onShowDetail(action)} // Toont detail bij klikken
                    >
                        <ListItemText
                            primary={action.title}
                            secondary={`Beschrijving: ${action.description || 'Geen'} - Toegewezen aan: ${action.assignee} - Vervaldatum: ${action.dueDate ? new Date(action.dueDate).toLocaleDateString('nl-NL') : 'Nvt'}`}
                        />
                        <IconButton onClick={(e) => { e.stopPropagation(); handleEdit(action); }} color="primary" aria-label="bewerken" style={{ marginRight: '10px' }}>
                            <EditIcon />
                        </IconButton>
                        <IconButton onClick={(e) => { e.stopPropagation(); handleDelete(action.id); }} color="error" aria-label="verwijderen">
                            <DeleteIcon />
                        </IconButton>
                    </ListItem>
                ))
            )}
        </List>
    );
}

export default ActieLijst;

