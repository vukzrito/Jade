import {
  Table, Button, Group, Text, Modal, Stack, TextInput, NumberInput, Select, Textarea, Badge,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { PageShell } from '../../components/ui/PageShell';
import { LoadingState } from '../../components/ui/LoadingState';
import {
  useServices, useCreateService, useUpdateService, useDeleteService,
  useCategories,
} from '../../hooks/useApi';

export function ServicesPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useServices(page);
  const { data: categories } = useCategories();
  const [opened, { open, close }] = useDisclosure(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();

  const form = useForm({
    initialValues: { name: '', description: '', duration: 30, price: 0, categoryId: '' },
  });

  const openCreate = () => {
    setEditingId(null);
    form.reset();
    open();
  };

  const openEdit = (service: any) => {
    setEditingId(service.id);
    form.setValues({
      name: service.name,
      description: service.description || '',
      duration: service.duration,
      price: Number(service.price),
      categoryId: service.categoryId || '',
    });
    open();
  };

  const handleSubmit = form.onSubmit((values) => {
    const payload = { ...values, categoryId: values.categoryId || undefined };

    if (editingId) {
      updateService.mutate({ id: editingId, ...payload }, { onSuccess: close });
    } else {
      createService.mutate(payload, { onSuccess: close });
    }
  });

  if (isLoading) return <LoadingState />;

  const catOptions = (categories ?? []).map((c) => ({
    value: c.id,
    label: c.name,
  }));
  catOptions.unshift({ value: '', label: 'No category' });

  return (
    <PageShell
      title="Services"
      actions={<Button onClick={openCreate}>Add Service</Button>}
    >
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Category</Table.Th>
            <Table.Th>Duration</Table.Th>
            <Table.Th>Price</Table.Th>
            <Table.Th>Active</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data?.data.map((service) => (
            <Table.Tr key={service.id}>
              <Table.Td>
                <Text size="sm">{service.name}</Text>
              </Table.Td>
              <Table.Td>{service.category?.name || '—'}</Table.Td>
              <Table.Td>{service.duration} min</Table.Td>
              <Table.Td>${Number(service.price).toFixed(2)}</Table.Td>
              <Table.Td>
                <Badge color={service.isActive ? 'green' : 'gray'} variant="light">
                  {service.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </Table.Td>
              <Table.Td>
                <Group gap="xs">
                  <Button size="xs" variant="light" onClick={() => openEdit(service)}>Edit</Button>
                  <Button size="xs" variant="light" color="red" onClick={() => deleteService.mutate(service.id)}>
                    Delete
                  </Button>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Modal opened={opened} onClose={close} title={editingId ? 'Edit Service' : 'Add Service'}>
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput label="Name" required {...form.getInputProps('name')} />
            <Select
              label="Category"
              data={catOptions}
              {...form.getInputProps('categoryId')}
            />
            <Textarea label="Description" {...form.getInputProps('description')} />
            <NumberInput label="Duration (minutes)" min={1} required {...form.getInputProps('duration')} />
            <NumberInput label="Price" min={0} decimalScale={2} required {...form.getInputProps('price')} />
            <Button type="submit" loading={createService.isPending || updateService.isPending}>
              {editingId ? 'Update' : 'Create'}
            </Button>
          </Stack>
        </form>
      </Modal>
    </PageShell>
  );
}
