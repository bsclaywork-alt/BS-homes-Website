import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class RootErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App runtime render error:', error, errorInfo);
  }

  handleReload = () => {
    try {
      localStorage.removeItem('bs_homez_portfolio_offline_cache');
    } catch {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#121212',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '24px', color: '#c5a059', marginBottom: '12px' }}>
            BS Homez Luxury Advisory
          </h1>
          <p style={{ color: '#aaaaaa', maxWidth: '480px', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>
            A temporary display issue occurred while loading property records. Please refresh the page to restore the latest portfolio view.
          </p>
          <button
            onClick={this.handleReload}
            style={{
              backgroundColor: '#c5a059',
              color: '#000000',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '4px',
              fontWeight: 'bold',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontSize: '12px'
            }}
          >
            Refresh Portfolio
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  </StrictMode>,
);

// Register service worker for offline portfolio caching & fast asset delivery
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      // Non-blocking log for offline worker registration
      console.debug('Service Worker registered with fallback:', err);
    });
  });
}
