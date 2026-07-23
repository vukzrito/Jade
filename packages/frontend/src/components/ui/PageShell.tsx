import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface PageShellProps {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export function PageShell({ title, children, actions }: PageShellProps) {
  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4 } }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          mb: 4,
        }}
      >
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        {actions && <Box sx={{ display: 'flex', gap: 1.5 }}>{actions}</Box>}
      </Box>
      {children}
    </Box>
  );
}
