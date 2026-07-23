import { createTheme } from '@mui/material/styles';

const palette = {
  bg: '#F8F7F4',
  surface: '#FFFFFF',
  primary: '#1E293B',
  accent: '#4F46E5',
  'accent-soft': '#EEF2FF',
  'text-primary': '#0F172A',
  'text-secondary': '#64748B',
  border: '#E2E8F0',
  success: '#10B981',
  error: '#EF4444',
  warm: '#F59E0B',
};

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: palette.accent,
      light: palette['accent-soft'],
      dark: '#4338CA',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: palette.primary,
    },
    text: {
      primary: palette['text-primary'],
      secondary: palette['text-secondary'],
    },
    background: {
      default: palette.bg,
      paper: palette.surface,
    },
    divider: palette.border,
    success: { main: palette.success },
    error: { main: palette.error },
    warning: { main: palette.warm },
  },
  typography: {
    fontFamily: '"Inter", "Inter Variable", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-0.02em', fontSize: '2.5rem', lineHeight: 1.2 },
    h2: { fontWeight: 700, letterSpacing: '-0.01em', fontSize: '2rem', lineHeight: 1.25 },
    h3: { fontWeight: 600, fontSize: '1.5rem', lineHeight: 1.3 },
    h4: { fontWeight: 600, fontSize: '1.25rem', lineHeight: 1.35 },
    h5: { fontWeight: 600, fontSize: '1.125rem', lineHeight: 1.4 },
    h6: { fontWeight: 600, fontSize: '1rem', lineHeight: 1.4 },
    subtitle1: { fontWeight: 500, fontSize: '1rem', lineHeight: 1.5 },
    subtitle2: { fontWeight: 500, fontSize: '0.875rem', lineHeight: 1.5 },
    body1: { fontWeight: 400, fontSize: '0.9375rem', lineHeight: 1.6 },
    body2: { fontWeight: 400, fontSize: '0.8125rem', lineHeight: 1.6 },
    button: { fontWeight: 600, fontSize: '0.875rem', textTransform: 'none' as const },
    caption: { fontWeight: 400, fontSize: '0.75rem', lineHeight: 1.5 },
    overline: { fontWeight: 600, fontSize: '0.6875rem', lineHeight: 1.5, letterSpacing: '0.08em', textTransform: 'uppercase' as const },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: palette.bg,
          color: palette['text-primary'],
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 20px',
          fontWeight: 600,
        },
        sizeSmall: {
          padding: '6px 14px',
          fontSize: '0.8125rem',
        },
        sizeLarge: {
          padding: '12px 28px',
          fontSize: '0.9375rem',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        outlined: {
          borderColor: palette.border,
          '&:hover': {
            borderColor: palette.accent,
            backgroundColor: palette['accent-soft'],
          },
        },
        text: {
          '&:hover': {
            backgroundColor: palette['accent-soft'],
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: `1px solid ${palette.border}`,
          boxShadow: 'none',
          backgroundColor: palette.surface,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        outlined: {
          borderColor: palette.border,
        },
        elevation1: {
          boxShadow: `0 1px 3px 0 rgba(0,0,0,0.04)`,
        },
        elevation2: {
          boxShadow: `0 4px 12px 0 rgba(0,0,0,0.06)`,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: palette.surface,
          },
        },
      },
    },
    MuiSelect: {
      defaultProps: {
        variant: 'outlined',
        size: 'small',
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: palette.surface,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: '1.125rem',
          fontWeight: 600,
          padding: '24px 24px 8px',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '16px 24px 24px',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '16px 24px',
          gap: 8,
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          '& .MuiTableHead-root .MuiTableCell-head': {
            fontWeight: 600,
            fontSize: '0.6875rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: palette['text-secondary'],
            backgroundColor: palette.bg,
            borderBottom: `1px solid ${palette.border}`,
          },
          '& .MuiTableBody-root .MuiTableCell-body': {
            fontSize: '0.875rem',
            color: palette['text-primary'],
            borderBottom: `1px solid ${palette.border}`,
          },
          '& .MuiTableRow-root:hover': {
            backgroundColor: palette['accent-soft'],
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
          fontSize: '0.75rem',
        },
        filled: {
          backgroundColor: palette['accent-soft'],
          color: palette.accent,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: `1px solid ${palette.border}`,
          backgroundColor: palette.surface,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          border: 'none',
          borderRight: `1px solid ${palette.border}`,
          backgroundColor: palette.surface,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 6,
          fontSize: '0.75rem',
          fontWeight: 500,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: '0.875rem',
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        dot: {
          borderRadius: '50%',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 10,
          border: `1px solid ${palette.border}`,
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '2px 8px',
          '&.Mui-selected': {
            backgroundColor: palette['accent-soft'],
            color: palette.accent,
            '&:hover': {
              backgroundColor: palette['accent-soft'],
            },
            '& .MuiListItemIcon-root': {
              color: palette.accent,
            },
          },
        },
      },
    },
  },
});
