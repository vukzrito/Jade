import {
  Table, Badge, Group, Text, Button, Modal, Stack, Select, TextInput, Textarea,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { PageShell } from '../../components/ui/PageShell';
import { LoadingState } from '../../components/ui/LoadingState';
import { useAppointments, useCreateAppointment, useUpdateAppointment, useDeleteAppointment } from '../../hooks/useApi';
import { useAllServices, useClients } from '../../hooks/useApi';
import { useAuthStore } from '../../stores/authStore';
import type { AppointmentStatus } from '../../types';

const statusColors: Record<AppointmentStatus, string> = {
  SCHEDULED: 'blue',
  CONFIRMED: 'teal',
  IN_PROGRESS: 'yellow',
  COMPLETED: 'green',
  CANCELLED: 'red',
  NO_SHOW: 'gray',
};

export function AppointmentsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAppointments({ page });
  const [opened, { open, close }] = useDisclosure(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const createApt = useCreateAppointment();
  const updateApt = useUpdateAppointment();
  const deleteApt = useDeleteAppointment();
  const currentUser = useAuthStore((s) => s.user);
  const { data: servicesData } = useAllServices();
  const { data: clientsData } = useClients(1);

  const form = useForm({
    initialValues: {
      clientId: '', userId: '', serviceId: '', startTime: '', endTime: '', notes: '',
    },
  });

  const openCreate = () => {
    setEditingId(null);
    form.reset();
    form.setFieldValue('userId', currentUser?.id ?? '');
    open();
  };

  const openEdit = (apt: any) => {
    setEditingId(apt.id);
    form.setValues({
      clientId: apt.clientId,
      userId: apt.userId,
      serviceId: apt.serviceId,
      startTime: apt.startTime.slice(0, 16),
      endTime: apt.endTime.slice(0, 16),
      notes: apt.notes || '',
    });
    open();
  };

  const handleSubmit = form.onSubmit((values) => {
    const payload = {
      ...values,
      startTime: new Date(values.startTime).toISOString(),
      endTime: new Date(values.endTime).toISOString(),
    };

    if (editingId) {
      updateApt.mutate({ id: editingId, ...payload }, { onSuccess: close });
    } else {
      createApt.mutate(payload, { onSuccess: close });
    }
  });

  if (isLoading) return <LoadingState />;

  return (
    <PageShell
      title="Appointments"
      actions={<Button onClick={openCreate}>New Appointment</Button>}
    >
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Client</Table.Th>
            <Table.Th>Service</Table.Th>
            <Table.Th>Staff</Table.Th>
            <Table.Th>Time</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data?.data.map((apt) => (
            <Table.Tr key={apt.id}>
              <Table.Td>
                <Text size="sm">{apt.client?.firstName} {apt.client?.lastName}</Text>
              </Table.Td>
              <Table.Td>{apt.service?.name}</Table.Td>
              <Table.Td>{apt.user?.firstName}</Table.Td>
              <Table.Td>
                {new Date(apt.startTime).toLocaleDateString()}{' '}
                {new Date(apt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Table.Td>
              <Table.Td>
                <Badge color={statusColors[apt.status]} variant="light" tt="capitalize">
                  {apt.status.toLowerCase().replace(/_/g, ' ')}
                </Badge>
              </Table.Td>
              <Table.Td>
                <Group gap="xs">
                  <Button size="xs" variant="light" onClick={() => openEdit(apt)}>Edit</Button>
                  <Button size="xs" variant="light" color="red" onClick={() => deleteApt.mutate(apt.id)}>
                    Delete
                  </Button>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Group justify="center" mt="md">
        <Button variant="light" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
          Previous
        </Button>
        <Text size="sm">Page {page} of {data?.meta?.totalPages || 1}</Text>
        <Button variant="light" disabled={page >= (data?.meta?.totalPages || 1)} onClick={() => setPage((p) => p + 1)}>
          Next
        </Button>
      </Group>

      <Modal
        opened={opened}
        onClose={close}
        title={editingId ? 'Edit Appointment' : 'New Appointment'}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <Stack>
            <Select
              label="Client"
              data={clientsData?.data?.map((c) => ({
                value: c.id,
                label: `${c.firstName} ${c.lastName}`,
              })) ?? []}
              searchable
              required
              {...form.getInputProps('clientId')}
            />
            <Select
              label="Service"
              data={servicesData?.map((s) => ({
                value: s.id,
                label: `${s.name} (${s.duration}min - $${s.price})`,
              })) ?? []}
              searchable
              required
              {...form.getInputProps('serviceId')}
            />
            <TextInput
              label="Start Time"
              type="datetime-local"
              required
              {...form.getInputProps('startTime')}
            />
            <TextInput
              label="End Time"
              type="datetime-local"
              required
              {...form.getInputProps('endTime')}
            />
            <Textarea label="Notes" {...form.getInputProps('notes')} />
            <Button type="submit" loading={createApt.isPending || updateApt.isPending}>
              {editingId ? 'Update' : 'Create'}
            </Button>
          </Stack>
        </form>
      </Modal>
    </PageShell>
  );
}
