import { Center, Loader, Stack, Text } from '@mantine/core';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <Center h="60vh">
      <Stack align="center" gap="sm">
        <Loader />
        <Text c="dimmed" size="sm">
          {message}
        </Text>
      </Stack>
    </Center>
  );
}
