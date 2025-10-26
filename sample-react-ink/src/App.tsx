import React, { useState, useEffect } from 'react';
import { Box, Text, useInput, useApp } from 'ink';
import chalk from 'chalk';
import { FileList, FileItem } from './components/FileList.js';
import { ProgressView } from './components/ProgressView.js';
import { Summary } from './components/Summary.js';

// ダミーファイルデータ
const initialFiles: FileItem[] = [
  { name: 'database.sql', size: '2.4 MB', status: 'pending' },
  { name: 'users.csv', size: '1.8 MB', status: 'pending' },
  { name: 'config.json', size: '12 KB', status: 'pending' },
  { name: 'logs.txt', size: '3.1 MB', status: 'pending' },
  { name: 'images.zip', size: '15.7 MB', status: 'pending' },
];

type AppState = 'idle' | 'processing' | 'completed';

export const App: React.FC = () => {
  const { exit } = useApp();
  const [state, setState] = useState<AppState>('idle');
  const [files, setFiles] = useState<FileItem[]>(initialFiles);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  // キーボード入力ハンドラ
  useInput((input, key) => {
    if (input === 'q' || (key.escape && state !== 'processing')) {
      exit();
    }
    if (input === ' ' && state === 'idle') {
      setState('processing');
      setStartTime(Date.now());
    }
  });

  // ファイル処理のシミュレーション
  useEffect(() => {
    if (state !== 'processing') return;

    if (currentIndex >= files.length) {
      setState('completed');
      setElapsedTime((Date.now() - startTime) / 1000);
      return;
    }

    // 現在のファイルを処理中に設定
    setFiles((prev) =>
      prev.map((file, idx) =>
        idx === currentIndex ? { ...file, status: 'processing' } : file,
      ),
    );

    // ファイル処理をシミュレート（500ms-1500msのランダムな時間）
    const processingTime = 500 + Math.random() * 1000;
    const timer = setTimeout(() => {
      // 処理完了に設定
      setFiles((prev) =>
        prev.map((file, idx) =>
          idx === currentIndex ? { ...file, status: 'completed' } : file,
        ),
      );
      setCurrentIndex((prev) => prev + 1);
    }, processingTime);

    return () => clearTimeout(timer);
  }, [state, currentIndex, files.length, startTime]);

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text bold>
          {chalk.blue('📁 File Processing Simulator')}
        </Text>
      </Box>

      <FileList files={files} />

      {state === 'idle' && (
        <Box flexDirection="column" marginY={1}>
          <Text>
            Press {chalk.bold('SPACE')} to start processing
          </Text>
          <Text dimColor>
            Press {chalk.bold('q')} to exit
          </Text>
        </Box>
      )}

      {state === 'processing' && (
        <ProgressView
          currentFile={files[currentIndex]?.name || ''}
          progress={currentIndex}
          total={files.length}
        />
      )}

      {state === 'completed' && (
        <Summary totalFiles={files.length} elapsedTime={elapsedTime} />
      )}
    </Box>
  );
};
