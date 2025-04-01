import React from 'react';
import { TextField, Typography, Button } from '@mui/material';

function ActieDetail({ action, onClose }) { // Voeg onClose prop toe
    if (!action) return null;

    return (
        <div>
            <Typography variant="h6" gutterBottom>
                Actie Details
            </Typography>
            <TextField
                label="Titel"
                value={action.title || ''}
                fullWidth
                margin="normal"
                InputProps={{ readOnly: true }}
            />
            <TextField
                label="Beschrijving"
                value={action.description || ''}
                fullWidth
                margin="normal"
                multiline
                rows={4}
                InputProps={{ readOnly: true }}
            />
            <TextField
                label="Toegewezen aan"
                value={action.assignee || ''}
                fullWidth
                margin="normal"
                InputProps={{ readOnly: true }}
            />
            <TextField
                label="Vervaldatum"
                value={action.dueDate ? new Date(action.dueDate).toLocaleDateString('nl-NL') : 'Nvt'}
                fullWidth
                margin="normal"
                InputProps={{ readOnly: true }}
            />
            <TextField
                label="Status"
                value={action.status || 'Pending'}
                fullWidth
                margin="normal"
                InputProps={{ readOnly: true }}
            />
            <TextField
                label="Gemaakt door"
                value={action.creator || ''}
                fullWidth
                margin="normal"
                InputProps={{ readOnly: true }}
            />
            <Button
                variant="contained"
                onClick={onClose} // Gebruik onClose in plaats van window.close
                style={{ marginTop: '20px' }}
            >
                Sluiten
            </Button>
        </div>
    );
}

export default ActieDetail;