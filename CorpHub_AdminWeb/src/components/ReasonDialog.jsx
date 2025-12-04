import React, { useState } from 'react';
import {

Dialog,
DialogTitle,
DialogContent,
DialogActions,
TextField,
Button,
} from '@mui/material';

export default function ReasonDialog({
open = false,
onClose,
onAction,
isAcceptDialog = true,
title = isAcceptDialog ? 'Confirm' : 'Reject',
}) {
const [reason, setReason] = useState('');

const handleSubmit = () => {
    onAction(reason);
    setReason('');
};

const handleClose = () => {
    setReason('');
    onClose();
};

const buttonColor = isAcceptDialog ? 'success' : 'error';

return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
            <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Enter your reason here..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                variant="outlined"
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose} variant="outlined">
                Cancel
            </Button>
            <Button
                onClick={handleSubmit}
                variant="contained"
                color={buttonColor}
            >
                {isAcceptDialog ? 'Accept' : 'Reject'}
            </Button>
        </DialogActions>
    </Dialog>
);
}