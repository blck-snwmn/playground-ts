import React from 'react';
import { Box, Text } from 'ink';
import chalk from 'chalk';

interface SummaryProps {
  totalFiles: number;
  elapsedTime: number;
}

export const Summary: React.FC<SummaryProps> = ({ totalFiles, elapsedTime }) => {
  return (
    <Box flexDirection="column" marginY={1} borderStyle="round" borderColor="green" padding={1}>
      <Text bold color="green">
        ✓ Processing Complete!
      </Text>
      <Box flexDirection="column" marginTop={1}>
        <Text>
          {chalk.bold('Files processed:')} {totalFiles}
        </Text>
        <Text>
          {chalk.bold('Time elapsed:')} {elapsedTime.toFixed(2)}s
        </Text>
      </Box>
      <Box marginTop={1}>
        <Text dimColor>
          Press {chalk.bold('q')} to exit
        </Text>
      </Box>
    </Box>
  );
};
