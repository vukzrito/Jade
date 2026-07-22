import { Container, Title, Group } from '@mantine/core';

interface PageShellProps {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export function PageShell({ title, children, actions }: PageShellProps) {
  return (
    <Container size="xl" py="lg">
      <Group justify="space-between" mb="lg">
        <Title order={2}>{title}</Title>
        {actions && <Group>{actions}</Group>}
      </Group>
      {children}
    </Container>
  );
}
