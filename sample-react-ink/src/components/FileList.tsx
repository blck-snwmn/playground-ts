import React from "react";
import { Box, Text } from "ink";
import chalk from "chalk";

export interface FileItem {
  name: string;
  size: string;
  status: "pending" | "processing" | "completed";
}

interface FileListProps {
  files: FileItem[];
}

export const FileList: React.FC<FileListProps> = ({ files }) => {
  return (
    <Box flexDirection="column" marginY={1}>
      <Text bold underline>
        Files to Process:
      </Text>
      <Box flexDirection="column" marginTop={1}>
        {files.map((file, index) => (
          <Box key={index} marginBottom={0}>
            <Text>
              {file.status === "completed" && chalk.green("✓ ")}
              {file.status === "processing" && chalk.yellow("⟳ ")}
              {file.status === "pending" && chalk.gray("○ ")}
              {file.status === "completed" && chalk.green(file.name)}
              {file.status === "processing" && chalk.yellow(file.name)}
              {file.status === "pending" && chalk.gray(file.name)}{" "}
              <Text dimColor>({file.size})</Text>
            </Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
