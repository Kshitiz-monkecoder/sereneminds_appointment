import { useState } from 'react';
import { Button, Progress, rgba, useMantineTheme } from '@mantine/core';
import { useInterval } from '@mantine/hooks';
import classes from './ButtonProgress.module.css';

interface ButtonProgressProps {
  onComplete: () => void; // Callback function to trigger when progress completes
}

export function ButtonProgress({ onComplete }: ButtonProgressProps) {
  const theme = useMantineTheme();
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const interval = useInterval(
    () =>
      setProgress((current) => {
        if (current < 100) {
          return current + 1;
        }

        interval.stop();
        setLoaded(true);
        onComplete(); // Trigger the onComplete callback
        return 0;
      }),
    20
  );

  return (
    <Button
      fullWidth
      className={classes.button}
      onClick={() => (loaded ? setLoaded(false) : !interval.active && interval.start())}
      styles={{
        root: {
          backgroundColor: loaded ? theme.colors.teal[6] : 'white', // Button background
          color: 'black', // Text color
          borderRadius: '1rem', // More rounded corners
          border: `1px solid ${theme.colors.gray[4]}`, // Optional border
          transition: 'background-color 150ms ease',
        },
      }}
    >
      <div className={classes.label}>
        {progress !== 0
          ? 'Scheduling your appointment'
          : loaded
          ? 'Redirecting to payment page'
          : 'Book my appointment'}
      </div>
      {progress !== 0 && (
        <Progress
          value={progress}
          className={classes.progress}
          color={rgba(theme.colors.blue[2], 0.35)}
          radius="sm"
        />
      )}
    </Button>
  );
}