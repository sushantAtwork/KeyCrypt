import React from 'react';
import { Box, Typography, Button } from '@mui/joy';

const ConfirmationDialog = ({ keyName, handleDeleteKey, keyCreated }) => {
  return (
    <Box
      sx={{
        padding: 3,
        borderRadius: 2,
        boxShadow: 1,
        backgroundColor: '#fff',
        maxWidth: 400,
        margin: 'auto',
      }}
    >
      <Typography
        variant="h6"
        sx={{
          marginBottom: 2,
          color: '#333',
          fontWeight: 500,
        }}
      >
        Are you sure you want to delete this key? This action cannot be undone.
      </Typography>
      <Typography
        sx={{
          marginBottom: 2,
          color: '#555',
        }}
      >
        Key Name: <strong>{keyName}</strong>
      </Typography>
      <Typography
        sx={{
          marginBottom: 3,
          color: '#666',
        }}
      >
        Please confirm if you want to proceed with the deletion.
      </Typography>
      <Button
        variant="solid"
        color="danger"
        onClick={handleDeleteKey}
        disabled={keyCreated}
        sx={{
          width: '100%',
          textTransform: 'none',
        }}
      >
        {keyCreated ? 'Deleting...' : 'Confirm Delete'}
      </Button>
    </Box>
  );
};

export default ConfirmationDialog;
