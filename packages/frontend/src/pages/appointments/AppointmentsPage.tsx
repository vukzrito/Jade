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
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight, DollarSign } from 'lucide-react';
import { PageShell } from '../../components/ui/PageShell';
import { LoadingState } from '../../components/ui/LoadingState';
import {
  useAppointments,
  useCreateAppointment,
  useUpdateAppointment,
  useDeleteAppointment,
  useAllServices,
  useClients,
  useCreatePayment,
  useUsers,
} from '../../hooks/useApi';
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
  serviceIds: string[];
  startTime: string;
  endTime: string;
  notes: string;
}

const emptyForm: FormState = {
  clientId: '', userId: '', serviceIds: [], startTime: '', endTime: '', notes: '',
};

export function AppointmentsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAppointments({ page });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [payingAppointmentId, setPayingAppointmentId] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD' | 'TRANSFER' | 'OTHER'>('CASH');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const createApt = useCreateAppointment();
  const updateApt = useUpdateAppointment();
  const deleteApt = useDeleteAppointment();
  const currentUser = useAuthStore((s) => s.user);
  const { data: servicesData } = useAllServices();
  const { data: clientsData } = useClients(1);
  const { data: usersData } = useUsers(1);
  const createPayment = useCreatePayment();

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
      serviceIds: apt.services?.map((s: any) => s.serviceId) ?? [],
      startTime: apt.startTime.slice(0, 16),
      endTime: apt.endTime.slice(0, 16),
      notes: apt.notes || '',
    });
    setDialogOpen(true);
  };

  const openPayment = (apt: any) => {
    const total = apt.services?.reduce((sum: number, s: any) => sum + Number(s.servicePrice), 0) ?? 0;
    const paid = apt.payments?.reduce((sum: number, p: any) => sum + Number(p.amount), 0) ?? 0;
    setPayingAppointmentId(apt.id);
    setPaymentAmount(total - paid);
    setPaymentMethod('CASH');
    setPaymentDialogOpen(true);
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

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingAppointmentId || paymentAmount <= 0) return;
    createPayment.mutate(
      { appointmentId: payingAppointmentId, amount: paymentAmount, method: paymentMethod },
      { onSuccess: () => setPaymentDialogOpen(false) },
    );
  };

  const totalForAppointment = (apt: any) =>
    apt.services?.reduce((sum: number, s: any) => sum + Number(s.servicePrice), 0) ?? 0;

  const paidForAppointment = (apt: any) =>
    apt.payments?.reduce((sum: number, p: any) => sum + Number(p.amount), 0) ?? 0;

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
              <TableCell>Services</TableCell>
              <TableCell>Staff</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Total</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.data.map((apt) => {
              const total = totalForAppointment(apt);
              const paid = paidForAppointment(apt);
              const due = total - paid;
              return (
                <TableRow key={apt.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {apt.client?.firstName} {apt.client?.lastName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack spacing={0.5}>
                      {apt.services?.map((s) => (
                        <Typography key={s.id} variant="body2" color="text.secondary">
                          {s.serviceName} <Typography variant="caption" color="text.secondary">(${Number(s.servicePrice).toFixed(2)})</Typography>
                        </Typography>
                      ))}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {apt.user?.firstName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                      {new Date(apt.startTime).toLocaleDateString()}{' '}
                      {new Date(apt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={apt.status.toLowerCase().replace(/_/g, ' ')} size="small" color={statusColors[apt.status]} />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      ${total.toFixed(2)}
                    </Typography>
                    {paid > 0 && (
                      <Typography variant="caption" color="success.main" sx={{ display: 'block' }}>
                        Paid: ${paid.toFixed(2)}
                      </Typography>
                    )}
                    {due > 0 && apt.status === 'COMPLETED' && (
                      <Typography variant="caption" color="warning.main" sx={{ display: 'block' }}>
                        Due: ${due.toFixed(2)}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
                      {apt.status === 'COMPLETED' && due > 0 && (
                        <Tooltip title="Record Payment">
                          <IconButton size="small" color="success" onClick={() => openPayment(apt)}>
                            <DollarSign size={16} />
                          </IconButton>
                        </Tooltip>
                      )}
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
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mt: 3 }}>
        <Button size="small" variant="outlined" startIcon={<ChevronLeft size={16} />} disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
          Previous
        </Button>
        <Typography variant="body2" color="text.secondary">
          Page {page} of {data?.meta?.totalPages || 1}
        </Typography>
        <Button size="small" variant="outlined" endIcon={<ChevronRight size={16} />} disabled={page >= (data?.meta?.totalPages || 1)} onClick={() => setPage((p) => p + 1)}>
          Next
        </Button>
      </Box>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogTitle>{editingId ? 'Edit Appointment' : 'New Appointment'}</DialogTitle>
          <DialogContent>
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <TextField select label="Client" fullWidth value={form.clientId} onChange={(e) => setForm((prev) => ({ ...prev, clientId: e.target.value }))}>
                {clientsData?.data?.map((c) => (
                  <MenuItem key={c.id} value={c.id}>{c.firstName} {c.lastName}</MenuItem>
                ))}
              </TextField>
              <FormControl fullWidth>
                <InputLabel>Services</InputLabel>
                <Select
                  multiple
                  value={form.serviceIds}
                  onChange={(e) => setForm((prev) => ({ ...prev, serviceIds: e.target.value as string[] }))}
                  input={<OutlinedInput label="Services" />}
                  renderValue={(selected) =>
                    selected
                      .map((id) => servicesData?.find((s) => s.id === id)?.name)
                      .filter(Boolean)
                      .join(', ')
                  }
                >
                  {servicesData?.map((s) => (
                    <MenuItem key={s.id} value={s.id}>
                      <Checkbox checked={form.serviceIds.includes(s.id)} size="small" />
                      <ListItemText primary={`${s.name} (${s.duration}min - $${s.price})`} />
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Select one or more services</FormHelperText>
              </FormControl>
              <TextField select label="Staff" fullWidth value={form.userId} onChange={(e) => setForm((prev) => ({ ...prev, userId: e.target.value }))}>
                {usersData?.data?.filter((u) => u.isActive !== false).map((u) => (
                  <MenuItem key={u.id} value={u.id}>{u.firstName} {u.lastName} ({u.role})</MenuItem>
                ))}
              </TextField>
              <TextField label="Start Time" type="datetime-local" fullWidth value={form.startTime} onChange={(e) => setForm((prev) => ({ ...prev, startTime: e.target.value }))} slotProps={{ inputLabel: { shrink: true } }} />
              <TextField label="End Time" type="datetime-local" fullWidth value={form.endTime} onChange={(e) => setForm((prev) => ({ ...prev, endTime: e.target.value }))} slotProps={{ inputLabel: { shrink: true } }} />
              <TextField label="Notes" multiline rows={3} fullWidth value={form.notes} onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))} />
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

      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onClose={() => setPaymentDialogOpen(false)} maxWidth="xs" fullWidth>
        <Box component="form" onSubmit={handlePayment}>
          <DialogTitle>Record Payment</DialogTitle>
          <DialogContent>
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <TextField label="Amount" type="number" fullWidth value={paymentAmount} onChange={(e) => setPaymentAmount(Number(e.target.value))} slotProps={{ htmlInput: { min: 0, step: 0.01 } }} />
              <TextField select label="Payment Method" fullWidth value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as any)}>
                <MenuItem value="CASH">Cash</MenuItem>
                <MenuItem value="CARD">Card</MenuItem>
                <MenuItem value="TRANSFER">Transfer</MenuItem>
                <MenuItem value="OTHER">Other</MenuItem>
              </TextField>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPaymentDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={createPayment.isPending || paymentAmount <= 0}>
              {createPayment.isPending ? 'Recording...' : 'Record Payment'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </PageShell>
  );
}
