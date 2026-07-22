import { NavLink, Stack, Text, ThemeIcon } from '@mantine/core';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

const links = [
  { label: 'Dashboard', path: '/dashboard', icon: '📊' },
  { label: 'Appointments', path: '/appointments', icon: '📅' },
  { label: 'Clients', path: '/clients', icon: '👥' },
  { label: 'Services', path: '/services', icon: '💇' },
  { label: 'Settings', path: '/settings', icon: '⚙️' },
];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((s) => s.user);

  return (
    <Stack h="100%" p="md" gap="xs">
      <Text fw={700} size="lg" mb="md" px="sm">
        Jade
      </Text>

      {links.map((link) => (
        <NavLink
          key={link.path}
          label={link.label}
          active={location.pathname === link.path || location.pathname.startsWith(link.path + '/')}
          onClick={() => navigate(link.path)}
          leftSection={
            <ThemeIcon variant="light" size="sm">
              {link.icon}
            </ThemeIcon>
          }
          styles={{
            root: {
              borderRadius: 'var(--mantine-radius-md)',
            },
          }}
        />
      ))}

      <Stack mt="auto" gap="xs">
        <Text size="xs" c="dimmed" px="sm">
          {user?.firstName} {user?.lastName}
        </Text>
        <Text size="xs" c="dimmed" px="sm" tt="capitalize">
          {user?.role?.toLowerCase()}
        </Text>
      </Stack>
    </Stack>
  );
}
