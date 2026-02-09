import React from "react";
import { Box, Text } from "ink";
import Spinner from "ink-spinner";
import { ProgressBar } from "@inkjs/ui";
import chalk from "chalk";

interface ProgressViewProps {
  currentFile: string;
  progress: number;
  total: number;
}

export const ProgressView: React.FC<ProgressViewProps> = ({ currentFile, progress, total }) => {
  const percentage = total > 0 ? (progress / total) * 100 : 0;

  return (
    <Box flexDirection="column" marginY={1}>
      <Box marginBottom={1}>
        <Text color="green">
          <Spinner type="dots" />
        </Text>
        <Text> Processing: {chalk.cyan(currentFile)}</Text>
      </Box>

      <Box flexDirection="column">
        <Box marginBottom={0}>
          <Text>
            Progress: {progress}/{total} files
          </Text>
        </Box>
        <Box width={40}>
          <ProgressBar value={percentage} />
        </Box>
      </Box>
    </Box>
  );
};
