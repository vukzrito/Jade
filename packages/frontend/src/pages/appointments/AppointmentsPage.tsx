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
import { useAppointments, useCreateAppointment, useUpdateAppointment, useDeleteAppointment, useAllServices, useClients } from '../../hooks/useApi';
import { useAuthStore } from '../../stores/authStore';
import type { AppointmentStatus } from '../../types';

const statusColors: Record<AppointmentStatus, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
  SCHEDULED: 'info',
  CONFIRMED: 'primary',
  IN_PROGRESS: 'warning',
  COMPLETED: 'success',
  CANCELLED: 'error',
  NO_SHOW: 'default',
};

interface FormState {
  clientId: string;
  userId: string;
  serviceId: string;
  startTime: string;
  endTime: string;
  notes: string;
}

const emptyForm: FormState = {
  clientId: '', userId: '', serviceId: '', startTime: '', endTime: '', notes: '',
};

export function AppointmentsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAppointments({ page });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const createApt = useCreateAppointment();
  const updateApt = useUpdateAppointment();
  const deleteApt = useDeleteAppointment();
  const currentUser = useAuthStore((s) => s.user);
  const { data: servicesData } = useAllServices();
  const { data: clientsData } = useClients(1);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, userId: currentUser?.id ?? '' });
    setDialogOpen(true);
  };

  const openEdit = (apt: any) => {
    setEditingId(apt.id);
    setForm({
      clientId: apt.clientId,
      userId: apt.userId,
      serviceId: apt.serviceId,
      startTime: apt.startTime.slice(0, 16),
      endTime: apt.endTime.slice(0, 16),
      notes: apt.notes || '',
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      startTime: new Date(form.startTime).toISOString(),
      endTime: new Date(form.endTime).toISOString(),
    };
    if (editingId) {
      updateApt.mutate({ id: editingId, ...payload } as any, { onSuccess: () => setDialogOpen(false) });
    } else {
      createApt.mutate(payload as any, { onSuccess: () => setDialogOpen(false) });
    }
  };

  if (isLoading) return <LoadingState />;

  return (
    <PageShell
      title="Appointments"
      actions={
        <Button variant="contained" startIcon={<Plus size={18} />} onClick={openCreate}>
          New Appointment
        </Button>
      }
    >
      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Client</TableCell>
              <TableCell>Service</TableCell>
              <TableCell>Staff</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.data.map((apt) => (
              <TableRow key={apt.id} hover>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {apt.client?.firstName} {apt.client?.lastName}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {apt.service?.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {apt.user?.firstName}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(apt.startTime).toLocaleDateString()}{' '}
                    {new Date(apt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={apt.status.toLowerCase().replace(/_/g, ' ')}
                    size="small"
                    color={statusColors[apt.status]}
                  />
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => openEdit(apt)}>
                        <Pencil size={16} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" color="error" onClick={() => deleteApt.mutate(apt.id)}>
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
          <DialogTitle>{editingId ? 'Edit Appointment' : 'New Appointment'}</DialogTitle>
          <DialogContent>
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <TextField
                select
                label="Client"
                fullWidth
                value={form.clientId}
                onChange={(e) => setForm((prev) => ({ ...prev, clientId: e.target.value }))}
              >
                {clientsData?.data?.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.firstName} {c.lastName}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Service"
                fullWidth
                value={form.serviceId}
                onChange={(e) => setForm((prev) => ({ ...prev, serviceId: e.target.value }))}
              >
                {servicesData?.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.name} ({s.duration}min - ${s.price})
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Start Time"
                type="datetime-local"
                fullWidth
                value={form.startTime}
                onChange={(e) => setForm((prev) => ({ ...prev, startTime: e.target.value }))}
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                label="End Time"
                type="datetime-local"
                fullWidth
                value={form.endTime}
                onChange={(e) => setForm((prev) => ({ ...prev, endTime: e.target.value }))}
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                label="Notes"
                multiline
                rows={3}
                fullWidth
                value={form.notes}
                onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={createApt.isPending || updateApt.isPending}>
              {editingId ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </PageShell>
  );
}
