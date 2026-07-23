import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { PageShell } from '../../components/ui/PageShell';
import { LoadingState } from '../../components/ui/LoadingState';
import { useServices, useCreateService, useUpdateService, useDeleteService, useCategories } from '../../hooks/useApi';

interface FormState {
  name: string;
  description: string;
  duration: number;
  price: number;
  categoryId: string;
}

const emptyForm: FormState = {
  name: '', description: '', duration: 30, price: 0, categoryId: '',
};

export function ServicesPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useServices(page);
  const { data: categories } = useCategories();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (service: any) => {
    setEditingId(service.id);
    setForm({
      name: service.name,
      description: service.description || '',
      duration: service.duration,
      price: Number(service.price),
      categoryId: service.categoryId || '',
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, categoryId: form.categoryId || undefined };
    if (editingId) {
      updateService.mutate({ id: editingId, ...payload } as any, { onSuccess: () => setDialogOpen(false) });
    } else {
      createService.mutate(payload as any, { onSuccess: () => setDialogOpen(false) });
    }
  };

  if (isLoading) return <LoadingState />;

  const catOptions = (categories ?? []).map((c: any) => ({ value: c.id, label: c.name }));
  catOptions.unshift({ value: '', label: 'No category' });

  return (
    <PageShell
      title="Services"
      actions={
        <Button variant="contained" startIcon={<Plus size={18} />} onClick={openCreate}>
          Add Service
        </Button>
      }
    >
      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Active</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.data.map((service) => (
              <TableRow key={service.id} hover>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {service.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {service.category?.name || '\u2014'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {service.duration} min
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    ${Number(service.price).toFixed(2)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={service.isActive ? 'Active' : 'Inactive'}
                    size="small"
                    color={service.isActive ? 'success' : 'default'}
                  />
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => openEdit(service)}>
                        <Pencil size={16} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" color="error" onClick={() => deleteService.mutate(service.id)}>
                        <Trash2 size={16} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mt: 3 }}>
        <Button
          size="small"
          variant="outlined"
          startIcon={<ChevronLeft size={16} />}
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Previous
        </Button>
        <Typography variant="body2" color="text.secondary">
          Page {page} of {data?.meta?.totalPages || 1}
        </Typography>
        <Button
          size="small"
          variant="outlined"
          endIcon={<ChevronRight size={16} />}
          disabled={page >= (data?.meta?.totalPages || 1)}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogTitle>{editingId ? 'Edit Service' : 'Add Service'}</DialogTitle>
          <DialogContent>
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <TextField label="Name" fullWidth value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
              <TextField select label="Category" fullWidth value={form.categoryId} onChange={(e) => setForm((prev) => ({ ...prev, categoryId: e.target.value }))}>
                {catOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </TextField>
              <TextField label="Description" multiline rows={3} fullWidth value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} />
              <TextField label="Duration (minutes)" type="number" fullWidth value={form.duration} onChange={(e) => setForm((prev) => ({ ...prev, duration: Number(e.target.value) }))} slotProps={{ htmlInput: { min: 1 } }} />
              <TextField label="Price" type="number" fullWidth value={form.price} onChange={(e) => setForm((prev) => ({ ...prev, price: Number(e.target.value) }))} slotProps={{ htmlInput: { min: 0, step: 0.01 } }} />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={createService.isPending || updateService.isPending}>
              {editingId ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </PageShell>
  );
}
