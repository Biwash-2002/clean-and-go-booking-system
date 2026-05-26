import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Container, Title, Text, Button, Card, Stack, Box } from '@mantine/core';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Box 
          style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            backgroundColor: '#f8f9fa',
            padding: '2rem'
          }}
        >
          <Container size="sm">
            <Card shadow="xl" radius="xl" padding="xl" style={{ border: 'none', overflow: 'hidden' }}>
              <Stack align="center" gap="lg" ta="center">
                <Box 
                  style={{ 
                    backgroundColor: '#ffe3e3', 
                    color: '#fa5252', 
                    padding: '1.2rem', 
                    borderRadius: '50%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <AlertCircle size={48} />
                </Box>

                <Stack gap="xs">
                  <Title order={2} style={{ color: '#2b2c3a', fontWeight: 800 }}>
                    Something went wrong
                  </Title>
                  <Text c="dimmed" size="sm">
                    We encountered an unexpected error while rendering this page. Don't worry, your booking data has not been lost.
                  </Text>
                </Stack>

                {this.state.error && (
                  <Box 
                    style={{ 
                      backgroundColor: '#f1f3f5', 
                      borderRadius: '12px', 
                      padding: '1rem', 
                      width: '100%', 
                      textAlign: 'left',
                      maxHeight: '150px',
                      overflowY: 'auto'
                    }}
                  >
                    <Text ff="monospace" size="xs" c="red" fw={600} style={{ wordBreak: 'break-all' }}>
                      {this.state.error.toString()}
                    </Text>
                  </Box>
                )}

                <Stack gap="sm" style={{ width: '100%' }}>
                  <Button 
                    fullWidth 
                    size="md" 
                    color="blue" 
                    radius="md"
                    leftSection={<RefreshCw size={16} />}
                    onClick={this.handleReload}
                  >
                    Reload Page
                  </Button>
                  <Button 
                    fullWidth 
                    size="md" 
                    variant="light" 
                    color="gray" 
                    radius="md"
                    leftSection={<Home size={16} />}
                    onClick={this.handleGoHome}
                  >
                    Go back Home
                  </Button>
                </Stack>
              </Stack>
            </Card>
          </Container>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
