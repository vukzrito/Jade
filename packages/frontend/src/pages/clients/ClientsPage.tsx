import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
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
import Chip from '@mui/material/Chip';
import Drawer from '@mui/material/Drawer';
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight, History, Gift } from 'lucide-react';
import { PageShell } from '../../components/ui/PageShell';
import { LoadingState } from '../../components/ui/LoadingState';
import {
  useClients,
  useCreateClient,
  useUpdateClient,
  useDeleteClient,
  useClientAppointments,
  useClientLoyalty,
  useRedeemReward,
  useAllServices,
} from '../../hooks/useApi';

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes: string;
}

const emptyForm: FormState = {
  firstName: '', lastName: '', email: '', phone: '', notes: '',
};

const statusColors: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
  SCHEDULED: 'info',
  CONFIRMED: 'primary',
  IN_PROGRESS: 'warning',
  COMPLETED: 'success',
  CANCELLED: 'error',
  NO_SHOW: 'default',
};

export function ClientsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useClients(page);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [historyClient, setHistoryClient] = useState<string | null>(null);
  const { data: clientHistory } = useClientAppointments(historyClient ?? '');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  const deleteClient = useDeleteClient();

  const [redeemClientId, setRedeemClientId] = useState<string | null>(null);
  const { data: loyaltyData } = useClientLoyalty(redeemClientId ?? '');
  const [redeemServiceId, setRedeemServiceId] = useState('');
  const { data: allServices } = useAllServices();
  const redeemReward = useRedeemReward();

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (client: any) => {
    setEditingId(client.id);
    setForm({
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email || '',
      phone: client.phone || '',
      notes: client.notes || '',
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateClient.mutate({ id: editingId, ...form } as any, { onSuccess: () => setDialogOpen(false) });
    } else {
      createClient.mutate(form as any, { onSuccess: () => setDialogOpen(false) });
    }
  };

  const openRedeem = (clientId: string) => {
    setRedeemClientId(clientId);
    setRedeemServiceId('');
  };

  const handleRedeem = () => {
    if (!redeemClientId || !redeemServiceId) return;
    redeemReward.mutate(
      { clientId: redeemClientId, serviceId: redeemServiceId },
      { onSuccess: () => { setRedeemClientId(null); setRedeemServiceId(''); } },
    );
  };

  if (isLoading) return <LoadingState />;

  return (
    <PageShell
      title="Clients"
      actions={
        <Button variant="contained" startIcon={<Plus size={18} />} onClick={openCreate}>
          Add Client
        </Button>
      }
    >
      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Stamps</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.data.map((client) => (
              <TableRow key={client.id} hover>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {client.firstName} {client.lastName}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {client.email || '\u2014'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {client.phone || '\u2014'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={`${client.stamps} stamps`}
                    size="small"
                    color={client.stamps > 0 ? 'warning' : 'default'}
                    variant={client.stamps > 0 ? 'filled' : 'outlined'}
                  />
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
                    <Tooltip title="Redeem Reward">
                      <span>
                        <IconButton size="small" color="secondary" disabled={client.stamps <= 0} onClick={() => openRedeem(client.id)}>
                          <Gift size={16} />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Service History">
                      <IconButton size="small" color="info" onClick={() => setHistoryClient(client.id)}>
                        <History size={16} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => openEdit(client)}>
                        <Pencil size={16} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" color="error" onClick={() => deleteClient.mutate(client.id)}>
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
          <DialogTitle>{editingId ? 'Edit Client' : 'Add Client'}</DialogTitle>
          <DialogContent>
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <TextField label="First Name" fullWidth value={form.firstName} onChange={(e) => setForm((prev) => ({ ...prev, firstName: e.target.value }))} />
              <TextField label="Last Name" fullWidth value={form.lastName} onChange={(e) => setForm((prev) => ({ ...prev, lastName: e.target.value }))} />
              <TextField label="Email" type="email" fullWidth value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} />
              <TextField label="Phone" type="tel" fullWidth value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} />
              <TextField label="Notes" multiline rows={3} fullWidth value={form.notes} onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))} />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={createClient.isPending || updateClient.isPending}>
              {editingId ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Redeem Reward Dialog */}
      <Dialog open={!!redeemClientId} onClose={() => setRedeemClientId(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Redeem Reward</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              This client has <strong>{loyaltyData?.stamps ?? 0}</strong> stamps (threshold: {loyaltyData?.rewardThreshold ?? 10}).
              {loyaltyData?.canRedeem ? ' They can redeem a free service!' : ' Not enough stamps yet.'}
            </Typography>
            {loyaltyData?.redeemedRewards && loyaltyData.redeemedRewards.length > 0 && (
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Previously redeemed:
                </Typography>
                {loyaltyData.redeemedRewards.map((r) => (
                  <Typography key={r.id} variant="caption" display="block" color="text.secondary">
                    {r.serviceName} ({new Date(r.createdAt).toLocaleDateString()})
                  </Typography>
                ))}
              </Box>
            )}
            <TextField select label="Free Service" fullWidth value={redeemServiceId} onChange={(e) => setRedeemServiceId(e.target.value)} disabled={!loyaltyData?.canRedeem}>
              {allServices?.filter((s) => s.isActive).map((s) => (
                <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
              ))}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRedeemClientId(null)}>Cancel</Button>
          <Button variant="contained" color="secondary" disabled={!redeemServiceId || !loyaltyData?.canRedeem || redeemReward.isPending} onClick={handleRedeem}>
            {redeemReward.isPending ? 'Redeeming...' : 'Redeem'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Service History Drawer */}
      <Drawer
        anchor="right"
        open={!!historyClient}
        onClose={() => setHistoryClient(null)}
        slotProps={{ paper: { sx: { width: { xs: '100%', sm: 420 } } } }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
            Service History
          </Typography>

          {!clientHistory || clientHistory.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No appointments found for this client.
            </Typography>
          ) : (
            <Stack spacing={2}>
              {clientHistory.map((apt) => {
                const total = apt.services?.reduce((s, sv) => s + Number(sv.servicePrice), 0) ?? 0;
                const stampsEarned = apt.services?.reduce((s, sv) => s + (sv.service as any)?.stampsEarned ?? 1, 0) ?? 0;
                return (
                  <Paper key={apt.id} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {new Date(apt.startTime).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {apt.user?.firstName} &middot; {new Date(apt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                      </Box>
                      <Chip label={apt.status.toLowerCase().replace(/_/g, ' ')} size="small" color={statusColors[apt.status] ?? 'default'} />
                    </Box>
                    <Stack spacing={0.5} sx={{ mt: 1 }}>
                      {apt.services?.map((s) => (
                        <Typography key={s.id} variant="body2" color="text.secondary" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>{s.serviceName}</span>
                          <span>${Number(s.servicePrice).toFixed(2)}</span>
                        </Typography>
                      ))}
                    </Stack>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                      <Typography variant="caption" color="warning.main" sx={{ fontWeight: 600 }}>
                        +{stampsEarned} stamp{stampsEarned !== 1 ? 's' : ''}
                      </Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        Total: ${total.toFixed(2)}
                      </Typography>
                    </Box>
                    {apt.payments && apt.payments.length > 0 && (
                      <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>
                          Paid: ${apt.payments.reduce((s, p) => s + Number(p.amount), 0).toFixed(2)}
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                );
              })}
            </Stack>
          )}
        </Box>
      </Drawer>
    </PageShell>
  );
}
