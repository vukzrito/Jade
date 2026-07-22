import { Group, ActionIcon, Text, Menu, Avatar, rem } from '@mantine/core';
import { useUiStore } from '../../stores/uiStore';
import { useAuthStore } from '../../stores/authStore';
import { useLogout } from '../../hooks/useAuth';

export function Header() {
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  return (
    <Group h="100%" px="md" justify="space-between">
      <Group>
        <ActionIcon variant="subtle" onClick={toggleSidebar} size="lg">
          <span style={{ fontSize: rem(20) }}>☰</span>
        </ActionIcon>
        <Text fw={600}>Jade</Text>
      </Group>

      <Menu shadow="md" width={200}>
        <Menu.Target>
          <Group style={{ cursor: 'pointer' }} gap="xs">
            <Avatar size="sm" color="initials" name={`${user?.firstName} ${user?.lastName}`} />
            <Text size="sm">
              {user?.firstName} {user?.lastName}
            </Text>
          </Group>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item onClick={() => window.location.href = '/settings'}>
            Settings
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item color="red" onClick={logout}>
            Log out
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}
