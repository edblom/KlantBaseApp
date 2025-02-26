import React, { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';
import axios from 'axios';

function ActieForm({ initialAction, onActionAdded, currentUser }) { // Voeg currentUser toe
    const [formData, setFormData] = useState({
        id: '',
        title: '',
        description: '',
        assignee: '',
        dueDate: '',
        status: 'Pending',
        creator: currentUser || 'jan' // Gebruik ingelogde gebruiker
    });

    useEffect(() => {
        if (initialAction) {
            setFormData({
                id: initialAction.id || '',
                title: initialAction.title || '',
                description: initialAction.description || '',
                assignee: initialAction.assignee || '',
                dueDate: initialAction.dueDate ? initialAction.dueDate.split('T')[0] : '',
                status: initialAction.status || 'Pending',
                creator: initialAction.creator || currentUser || 'jan'
            });
        } else {
            setFormData({
                id: '',
                title: '',
                description: '',
                assignee: '',
                dueDate: '',
                status: 'Pending',
                creator: currentUser || 'jan'
            });
        }
    }, [initialAction, currentUser]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const actionData = {
            ...formData,
            dueDate: formData.dueDate ? `${formData.dueDate}T00:00:00` : new Date().toISOString()
        };
        if (!actionData.id) {
            delete actionData.id;
        }

        console.log('Verzonden data:', actionData);
        try {
            if (actionData.id) {
                const response = await axios.put(`https://localhost:44361/api/actions/${actionData.id}`, actionData);
                console.log('Actie bijgewerkt:', response.data);
            } else {
                const response = await axios.post('https://localhost:44361/api/actions', actionData);
                console.log('Actie toegevoegd:', response.data);
            }
            setFormData({
                id: '',
                title: '',
                description: '',
                assignee: '',
                dueDate: '',
                status: 'Pending',
                creator: currentUser || 'jan'
            });
            if (onActionAdded) onActionAdded();
        } catch (error) {
            console.error('Fout bij opslaan actie:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <TextField name="title" label="Titel" value={formData.title} onChange={handleInputChange} fullWidth margin="normal" />
            <TextField name="description" label="Beschrijving" value={formData.description} onChange={handleInputChange} multiline rows={4} fullWidth margin="normal" />
            <TextField name="assignee" label="Toegewezen aan" value={formData.assignee} onChange={handleInputChange} fullWidth margin="normal" />
            <TextField name="dueDate" label="Vervaldatum" type="date" value={formData.dueDate} onChange={handleInputChange} InputLabelProps={{ shrink: true }} fullWidth margin="normal" />
            <Button type="submit" variant="contained" color="primary">
                {formData.id ? 'Opslaan' : 'Actie Toevoegen'}
            </Button>
        </form>
    );
}

export default ActieForm;