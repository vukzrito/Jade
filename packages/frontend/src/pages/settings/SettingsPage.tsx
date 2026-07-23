import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PageShell } from '../../components/ui/PageShell';
import { LoadingState } from '../../components/ui/LoadingState';
import { useTenant } from '../../hooks/useApi';
import * as tenantsApi from '../../api/tenants';

export function SettingsPage() {
  const { data: tenant, isLoading } = useTenant();
  const qc = useQueryClient();
  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '', timezone: 'UTC',
  });
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (tenant) {
      setForm({
        name: tenant.name ?? '',
        email: tenant.email ?? '',
        phone: tenant.phone ?? '',
        address: tenant.address ?? '',
        timezone: tenant.timezone ?? 'UTC',
      });
    }
  }, [tenant]);

  const updateMutation = useMutation({
    mutationFn: tenantsApi.updateTenant,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenant'] });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(form as any);
  };

  if (isLoading) return <LoadingState />;

  return (
    <PageShell title="Settings">
      <Card variant="outlined" sx={{ maxWidth: 600 }}>
        <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Business Details
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <TextField label="Business Name" fullWidth value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
              <TextField label="Email" type="email" fullWidth value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} />
              <TextField label="Phone" type="tel" fullWidth value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} />
              <TextField label="Address" fullWidth value={form.address} onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))} />
              <TextField label="Timezone" fullWidth value={form.timezone} onChange={(e) => setForm((prev) => ({ ...prev, timezone: e.target.value }))} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button type="submit" variant="contained" disabled={updateMutation.isPending} sx={{ minWidth: 100 }}>
                  {updateMutation.isPending ? 'Saving...' : 'Save'}
                </Button>
                {showSuccess && (
                  <Alert severity="success" sx={{ py: 0, '& .MuiAlert-message': { py: 0.75 } }}>
                    Settings updated
                  </Alert>
                )}
              </Box>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </PageShell>
  );
}
