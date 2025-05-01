'use client';

import { Box, Flex } from '@radix-ui/themes';

export function Loading() {
  return (
    <Flex align="center" justify="center" style={{ height: '100vh' }}>
      <Box className="loader" />
    </Flex>
  );
} 