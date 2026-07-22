import {
  SimpleGrid, Paper, Text, Title, Group,
} from '@mantine/core';
import { useAppointmentsByDate } from '../../hooks/useApi';
import { PageShell } from '../../components/ui/PageShell';
import { LoadingState } from '../../components/ui/LoadingState';

export function DashboardPage() {
  const today = new Date().toISOString().split('T')[0];
  const { data: appointments, isLoading } = useAppointmentsByDate(today);

  if (isLoading) return <LoadingState />;

  const scheduled = appointments?.filter((a) => a.status === 'SCHEDULED' || a.status === 'CONFIRMED') ?? [];
  const completed = appointments?.filter((a) => a.status === 'COMPLETED') ?? [];
  const cancelled = appointments?.filter((a) => a.status === 'CANCELLED') ?? [];
  // Derive total revenue: appointments with services
  const totalRevenue = completed.reduce((sum, a) => sum + Number(a.service?.price ?? 0), 0);

  return (
    <PageShell title="Dashboard">
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} mb="xl">
        <Paper withBorder p="md" radius="md">
          <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Today's Total</Text>
          <Title order={3}>{appointments?.length ?? 0}</Title>
        </Paper>
        <Paper withBorder p="md" radius="md">
          <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Upcoming</Text>
          <Title order={3}>{scheduled.length}</Title>
        </Paper>
        <Paper withBorder p="md" radius="md">
          <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Completed</Text>
          <Title order={3}>{completed.length}</Title>
        </Paper>
        <Paper withBorder p="md" radius="md">
          <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Revenue</Text>
          <Title order={3}>${totalRevenue.toFixed(2)}</Title>
        </Paper>
      </SimpleGrid>

      <Title order={3} mb="md">Today's Appointments</Title>
      {appointments?.length === 0 ? (
        <Text c="dimmed">No appointments today</Text>
      ) : (
        <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }}>
          {appointments?.map((apt) => (
            <Paper key={apt.id} withBorder p="md" radius="md">
              <Group justify="space-between" mb="xs">
                <Text fw={600}>
                  {apt.client?.firstName} {apt.client?.lastName}
                </Text>
                <Text size="sm" c="dimmed">
                  {new Date(apt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </Group>
              <Text size="sm">{apt.service?.name}</Text>
              <Text size="xs" c="dimmed" tt="capitalize">
                {apt.status.toLowerCase().replace(/_/g, ' ')} — {apt.user?.firstName}
              </Text>
            </Paper>
          ))}
        </SimpleGrid>
      )}
    </PageShell>
  );
}
