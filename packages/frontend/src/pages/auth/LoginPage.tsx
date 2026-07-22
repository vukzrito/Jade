import {
  Container, Paper, Title, TextInput, PasswordInput, Button, Stack, Text, Anchor,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Link } from 'react-router-dom';
import { useLogin } from '../../hooks/useAuth';

export function LoginPage() {
  const login = useLogin();
  const form = useForm({
    initialValues: { email: '', password: '' },
    validate: {
      email: (v) => (/^\S+@\S+$/.test(v) ? null : 'Invalid email'),
      password: (v) => (v.length < 6 ? 'Password must be at least 6 characters' : null),
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    login.mutate(values);
  });

  return (
    <Container size={420} my={120}>
      <Title ta="center" mb="md">Welcome back</Title>
      <Paper withBorder shadow="md" p="xl" radius="md">
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              label="Email"
              placeholder="you@example.com"
              required
              {...form.getInputProps('email')}
            />
            <PasswordInput
              label="Password"
              placeholder="Your password"
              required
              {...form.getInputProps('password')}
            />
            <Button type="submit" fullWidth loading={login.isPending}>
              Sign in
            </Button>
          </Stack>
        </form>
        <Text c="dimmed" size="sm" ta="center" mt="md">
          Don't have an account?{' '}
          <Anchor component={Link} to="/register" size="sm">
            Create one
          </Anchor>
        </Text>
      </Paper>
    </Container>
  );
}
