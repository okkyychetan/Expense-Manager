import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#22D3EE',
      light: '#67E8F9',
      dark: '#0891B2',
    },
    secondary: {
      main: '#A78BFA',
      light: '#C4B5FD',
      dark: '#7C3AED',
    },
    success: {
      main: '#4ADE80',
      light: '#86EFAC',
    },
    error: {
      main: '#F87171',
      light: '#FCA5A5',
    },
    warning: {
      main: '#FBBF24',
    },
    background: {
      default: '#080D1A',
      paper: '#0D1526',
    },
    text: {
      primary: '#E2E8F0',
      secondary: '#94A3B8',
    },
    divider: 'rgba(255,255,255,0.06)',
  },
  typography: {
    fontFamily: "'Nunito', sans-serif",
    h1: { fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800 },
    h2: { fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700 },
    h3: { fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700 },
    h4: { fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700 },
    h5: { fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 600 },
    h6: { fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 600 },
    button: { fontFamily: "'Nunito', sans-serif", fontWeight: 700, letterSpacing: 0.5 },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: '#080D1A',
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': { width: 6 },
          '&::-webkit-scrollbar-thumb': { backgroundColor: '#1E3A5F', borderRadius: 3 },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(13,21,38,0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 20,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 700,
          fontSize: '0.95rem',
          padding: '10px 24px',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #22D3EE, #0891B2)',
          boxShadow: '0 8px 24px rgba(34,211,238,0.25)',
          '&:hover': {
            background: 'linear-gradient(135deg, #67E8F9, #22D3EE)',
            boxShadow: '0 12px 32px rgba(34,211,238,0.35)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            background: 'rgba(255,255,255,0.03)',
            '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
            '&:hover fieldset': { borderColor: 'rgba(34,211,238,0.4)' },
            '&.Mui-focused fieldset': { borderColor: '#22D3EE' },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 600, fontFamily: "'Nunito', sans-serif" },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          background: '#0D1526',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 24,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: '#1E3A5F',
          fontSize: '0.8rem',
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;
