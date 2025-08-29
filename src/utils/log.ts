type LogColor = 'red' | 'green' | 'yellow';

const logWithSeparator = (message: string, color: LogColor = 'red'): void => {
  const colors: Record<LogColor, string> = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
  };

  const resetColor = '\x1b[0m';
  const separator = '--------------------------------------------';

  console.log(`${colors[color]}${message}${resetColor}`);
  console.log(separator);
};

export { logWithSeparator };