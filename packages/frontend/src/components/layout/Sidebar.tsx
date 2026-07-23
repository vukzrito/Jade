import { useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { LayoutDashboard, Calendar, Users, Scissors, Settings } from 'lucide-react';

const links = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Appointments', path: '/appointments', icon: Calendar },
  { label: 'Clients', path: '/clients', icon: Users },
  { label: 'Services', path: '/services', icon: Scissors },
  { label: 'Settings', path: '/settings', icon: Settings },
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  const handleNav = (path: string) => {
    navigate(path);
    onClose?.();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ px: 3, pt: 3, pb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.03em', color: 'text.primary' }}>
          Jade
        </Typography>
      </Box>

      <Divider />

      <List sx={{ flex: 1, py: 2 }}>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <ListItemButton
              key={link.path}
              selected={isActive(link.path)}
              onClick={() => handleNav(link.path)}
              sx={{ mb: 0.5 }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Icon size={20} />
              </ListItemIcon>
              <ListItemText
                primary={link.label}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontSize: '0.875rem',
                    fontWeight: isActive(link.path) ? 600 : 500,
                  },
                }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
}
