import {
  Table, Button, Group, Text, Modal, Stack, TextInput, Textarea, ActionIcon,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { PageShell } from '../../components/ui/PageShell';
import { LoadingState } from '../../components/ui/LoadingState';
import { useClients, useCreateClient, useUpdateClient, useDeleteClient } from '../../hooks/useApi';

export function ClientsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useClients(page);
  const [opened, { open, close }] = useDisclosure(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  const deleteClient = useDeleteClient();

  const form = useForm({
    initialValues: { firstName: '', lastName: '', email: '', phone: '', notes: '' },
  });

  const openCreate = () => {
    setEditingId(null);
    form.reset();
    open();
  };

  const openEdit = (client: any) => {
    setEditingId(client.id);
    form.setValues({
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email || '',
      phone: client.phone || '',
      notes: client.notes || '',
    });
    open();
  };

  const handleSubmit = form.onSubmit((values) => {
    if (editingId) {
      updateClient.mutate({ id: editingId, ...values }, { onSuccess: close });
    } else {
      createClient.mutate(values, { onSuccess: close });
    }
  });

  if (isLoading) return <LoadingState />;

  return (
    <PageShell
      title="Clients"
      actions={<Button onClick={openCreate}>Add Client</Button>}
    >
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Phone</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data?.data.map((client) => (
            <Table.Tr key={client.id}>
              <Table.Td>
                <Text size="sm">{client.firstName} {client.lastName}</Text>
              </Table.Td>
              <Table.Td>{client.email || '—'}</Table.Td>
              <Table.Td>{client.phone || '—'}</Table.Td>
              <Table.Td>
                <Group gap="xs">
                  <Button size="xs" variant="light" onClick={() => openEdit(client)}>Edit</Button>
                  <Button size="xs" variant="light" color="red" onClick={() => deleteClient.mutate(client.id)}>
                    Delete
                  </Button>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Group justify="center" mt="md">
        <Button variant="light" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
        <Text size="sm">Page {page} of {data?.meta?.totalPages || 1}</Text>
        <Button variant="light" disabled={page >= (data?.meta?.totalPages || 1)} onClick={() => setPage((p) => p + 1)}>Next</Button>
      </Group>

      <Modal opened={opened} onClose={close} title={editingId ? 'Edit Client' : 'Add Client'}>
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput label="First Name" required {...form.getInputProps('firstName')} />
            <TextInput label="Last Name" required {...form.getInputProps('lastName')} />
            <TextInput label="Email" {...form.getInputProps('email')} />
            <TextInput label="Phone" {...form.getInputProps('phone')} />
            <Textarea label="Notes" {...form.getInputProps('notes')} />
            <Button type="submit" loading={createClient.isPending || updateClient.isPending}>
              {editingId ? 'Update' : 'Create'}
            </Button>
          </Stack>
        </form>
      </Modal>
    </PageShell>
  );
}
