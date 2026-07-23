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
import { Plus, Trash2, Shield, User } from 'lucide-react';
import { PageShell } from '../../components/ui/PageShell';
import { LoadingState } from '../../components/ui/LoadingState';
import { useUsers, useCreateUser, useDeleteUser } from '../../hooks/useApi';

interface FormState {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'STAFF';
  phone: string;
}

const emptyForm: FormState = {
  email: '', password: '', firstName: '', lastName: '', role: 'STAFF', phone: '',
};

export function TeamPage() {
  const { data, isLoading } = useUsers();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const createUser = useCreateUser();
  const deleteUser = useDeleteUser();

  const openCreate = () => {
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createUser.mutate(form as any, {
      onSuccess: () => {
        setDialogOpen(false);
        setForm(emptyForm);
      },
    });
  };

  if (isLoading) return <LoadingState />;

  return (
    <PageShell
      title="Team"
      actions={
        <Button variant="contained" startIcon={<Plus size={18} />} onClick={openCreate}>
          Add Staff
        </Button>
      }
    >
      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.data.map((member) => (
              <TableRow key={member.id} hover>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {member.firstName} {member.lastName}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {member.email}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    icon={member.role === 'OWNER' ? <Shield size={14} /> : <User size={14} />}
                    label={member.role.toLowerCase()}
                    size="small"
                    color={member.role === 'OWNER' ? 'warning' : member.role === 'ADMIN' ? 'primary' : 'default'}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={member.isActive ? 'Active' : 'Inactive'}
                    size="small"
                    color={member.isActive ? 'success' : 'default'}
                  />
                </TableCell>
                <TableCell align="right">
                  {member.role !== 'OWNER' && (
                    <Tooltip title="Remove">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => deleteUser.mutate(member.id)}
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogTitle>Add Staff Member</DialogTitle>
          <DialogContent>
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <TextField label="First Name" fullWidth value={form.firstName} onChange={(e) => setForm((prev) => ({ ...prev, firstName: e.target.value }))} />
              <TextField label="Last Name" fullWidth value={form.lastName} onChange={(e) => setForm((prev) => ({ ...prev, lastName: e.target.value }))} />
              <TextField label="Email" type="email" fullWidth value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} />
              <TextField label="Password" type="password" fullWidth value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} helperText="Minimum 6 characters" />
              <TextField
                select
                label="Role"
                fullWidth
                value={form.role}
                onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value as 'ADMIN' | 'STAFF' }))}
              >
                <MenuItem value="STAFF">Staff</MenuItem>
                <MenuItem value="ADMIN">Admin</MenuItem>
              </TextField>
              <TextField label="Phone" type="tel" fullWidth value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={createUser.isPending}>
              {createUser.isPending ? 'Adding...' : 'Add Staff'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </PageShell>
  );
}
