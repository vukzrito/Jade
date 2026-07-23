import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import { DollarSign, CalendarCheck, Clock, CheckCircle2 } from 'lucide-react';
import { PageShell } from '../../components/ui/PageShell';
import { LoadingState } from '../../components/ui/LoadingState';
import { useAppointmentsByDate } from '../../hooks/useApi';

const statCards = [
  { key: 'total', label: "Today's Total", icon: CalendarCheck, color: 'primary.main' as const },
  { key: 'upcoming', label: 'Upcoming', icon: Clock, color: 'warning.main' as const },
  { key: 'completed', label: 'Completed', icon: CheckCircle2, color: 'success.main' as const },
  { key: 'revenue', label: 'Revenue', icon: DollarSign, color: 'primary.main' as const },
];

export function DashboardPage() {
  const today = new Date().toISOString().split('T')[0];
  const { data: appointments, isLoading } = useAppointmentsByDate(today);

  if (isLoading) return <LoadingState />;

  const scheduled = appointments?.filter((a) => a.status === 'SCHEDULED' || a.status === 'CONFIRMED') ?? [];
  const completed = appointments?.filter((a) => a.status === 'COMPLETED') ?? [];
  const totalRevenue = completed.reduce((sum, a) => sum + Number(a.service?.price ?? 0), 0);

  const stats = {
    total: appointments?.length ?? 0,
    upcoming: scheduled.length,
    completed: completed.length,
    revenue: `$${totalRevenue.toFixed(2)}`,
  };

  const statusColors: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
    SCHEDULED: 'info',
    CONFIRMED: 'primary',
    IN_PROGRESS: 'warning',
    COMPLETED: 'success',
    CANCELLED: 'error',
    NO_SHOW: 'default',
  };

  return (
    <PageShell title="Dashboard">
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const value = stats[stat.key as keyof typeof stats];
          return (
            <Grid key={stat.key} size={{ xs: 6, lg: 3 }}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                      {stat.label}
                    </Typography>
                    <Icon size={20} color={stat.color} />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Typography variant="h5" sx={{ mb: 2 }}>
        Today&apos;s Appointments
      </Typography>

      {appointments?.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No appointments today
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {appointments?.map((apt) => (
            <Grid key={apt.id} size={{ xs: 12, sm: 6, lg: 4 }}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {apt.client?.firstName} {apt.client?.lastName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.25 }}>
                      {new Date(apt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                    {apt.service?.name}
                  </Typography>
                  <Chip
                    label={apt.status.toLowerCase().replace(/_/g, ' ')}
                    size="small"
                    color={statusColors[apt.status]}
                    variant="filled"
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </PageShell>
  );
}
