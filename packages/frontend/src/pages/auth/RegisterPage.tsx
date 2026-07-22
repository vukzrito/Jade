import {
  Container, Paper, Title, TextInput, PasswordInput, Button, Stack, Text, Anchor,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Link } from 'react-router-dom';
import { useRegister } from '../../hooks/useAuth';

export function RegisterPage() {
  const register = useRegister();
  const form = useForm({
    initialValues: {
      email: '', password: '', firstName: '', lastName: '', tenantName: '', phone: '',
    },
    validate: {
      email: (v) => (/^\S+@\S+$/.test(v) ? null : 'Invalid email'),
      password: (v) => (v.length < 6 ? 'Password must be at least 6 characters' : null),
      firstName: (v) => (v.length < 1 ? 'Required' : null),
      lastName: (v) => (v.length < 1 ? 'Required' : null),
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    register.mutate({
      email: values.email,
      password: values.password,
      firstName: values.firstName,
      lastName: values.lastName,
      tenantName: values.tenantName || undefined,
      phone: values.phone || undefined,
    });
  });

  return (
    <Container size={420} my={120}>
      <Title ta="center" mb="md">Create your account</Title>
      <Paper withBorder shadow="md" p="xl" radius="md">
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput label="First Name" required {...form.getInputProps('firstName')} />
            <TextInput label="Last Name" required {...form.getInputProps('lastName')} />
            <TextInput label="Email" required {...form.getInputProps('email')} />
            <PasswordInput label="Password" required {...form.getInputProps('password')} />
            <TextInput label="Business Name" {...form.getInputProps('tenantName')} />
            <TextInput label="Phone" {...form.getInputProps('phone')} />
            <Button type="submit" fullWidth loading={register.isPending}>
              Create account
            </Button>
          </Stack>
        </form>
        <Text c="dimmed" size="sm" ta="center" mt="md">
          Already have an account?{' '}
          <Anchor component={Link} to="/login" size="sm">
            Sign in
          </Anchor>
        </Text>
      </Paper>
    </Container>
  );
}
