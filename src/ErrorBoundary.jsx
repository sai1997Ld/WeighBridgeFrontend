import { useState, useEffect } from 'react';
import { Box, Typography, Container } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const errorHandler = (error) => {
      console.error('Uncaught error:', error);
      setHasError(true);
    };

    window.addEventListener('error', errorHandler);

    return () => {
      window.removeEventListener('error', errorHandler);
    };
  }, []);

  if (hasError) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
          }}
        >
          <ErrorOutlineIcon 
            sx={{ 
              fontSize: 100, 
              color: 'error.main',
              mb: 2
            }} 
          />
          <Typography variant="h4" component="h1" gutterBottom>
            Oops! Something went wrong.
          </Typography>
          <Typography variant="body1">
            We&apos;re sorry for the inconvenience. Please try refreshing the page or contact support if the problem persists.
          </Typography>
        </Box>
      </Container>
    );
  }

  return children;
};

export default ErrorBoundary;