import { Paper, Stack, TextInput, Button, Title, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { PageShell } from '../../components/ui/PageShell';
import { LoadingState } from '../../components/ui/LoadingState';
import { useTenant } from '../../hooks/useApi';
import * as tenantsApi from '../../api/tenants';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';

export function SettingsPage() {
  const { data: tenant, isLoading } = useTenant();
  const qc = useQueryClient();

  const form = useForm({
    initialValues: {
      name: tenant?.name ?? '',
      email: tenant?.email ?? '',
      phone: tenant?.phone ?? '',
      address: tenant?.address ?? '',
      timezone: tenant?.timezone ?? 'UTC',
    },
  });

  const updateMutation = useMutation({
    mutationFn: tenantsApi.updateTenant,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenant'] });
      notifications.show({ title: 'Saved', message: 'Settings updated', color: 'green' });
    },
    onError: () => {
      notifications.show({ title: 'Error', message: 'Failed to update settings', color: 'red' });
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    updateMutation.mutate(values);
  });

  if (isLoading) return <LoadingState />;

  return (
    <PageShell title="Settings">
      <Paper withBorder p="xl" radius="md" maw={600}>
        <Title order={4} mb="md">Business Details</Title>
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput label="Business Name" required {...form.getInputProps('name')} />
            <TextInput label="Email" required {...form.getInputProps('email')} />
            <TextInput label="Phone" {...form.getInputProps('phone')} />
            <TextInput label="Address" {...form.getInputProps('address')} />
            <TextInput label="Timezone" {...form.getInputProps('timezone')} />
            <Button type="submit" loading={updateMutation.isPending} maw={120}>
              Save
            </Button>
          </Stack>
        </form>
      </Paper>
    </PageShell>
  );
}
