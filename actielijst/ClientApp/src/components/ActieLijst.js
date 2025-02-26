import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Button } from '@mui/material';
import axios from 'axios';

function ActieLijst({ userId, refreshTrigger, onEditAction }) { // Ontvang userId als prop
    const [actions, setActions] = useState([]);

    useEffect(() => {
        const fetchActions = async () => {
            try {
                const response = await axios.get(`https://localhost:44361/api/actions/user/${userId}`);
                setActions(response.data);
            } catch (error) {
                console.error('Fout bij ophalen acties:', error);
            }
        };
        fetchActions();
    }, [userId, refreshTrigger]);

    const handleEdit = (action) => {
        if (onEditAction) onEditAction(action);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://localhost:44361/api/actions/${id}`);
            console.log('Actie verwijderd:', id);
            const response = await axios.get(`https://localhost:44361/api/actions/user/${userId}`);
            setActions(response.data);
        } catch (error) {
            console.error('Fout bij verwijderen actie:', error);
        }
    };

    return (
        <List>
            {actions.map((action) => (
                <ListItem key={action.id}>
                    <ListItemText
                        primary={action.title}
                        secondary={`Beschrijving: ${action.description} - Toegewezen aan: ${action.assignee} - Vervaldatum: ${new Date(action.dueDate).toLocaleDateString('nl-NL')}`}
                    />
                    <Button variant="outlined" onClick={() => handleEdit(action)} style={{ marginRight: '10px' }}>Bewerken</Button>
                    <Button variant="outlined" color="error" onClick={() => handleDelete(action.id)}>Verwijderen</Button>
                </ListItem>
            ))}
        </List>
    );
}

export default ActieLijst;