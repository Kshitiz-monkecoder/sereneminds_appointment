import { Button, Container, Group, Text, Title } from '@mantine/core';
import classes from './ServerError.module.css';

export function ServerError() {
  return (
    <div className={classes.root}>
      <Container className={classes.fullScreen}>
        <div className={classes.label}>ERROR</div>
        <Title className={classes.title}>Something bad just happened...</Title>
        <Text size="lg" ta="center" className={classes.description}>
          Our servers could not handle your request. Don&apos;t worry, Try scheduling again.
        </Text>
        <Group justify="center">
          <Button variant="white" size="md">
            Try again
          </Button>
        </Group>
      </Container>
    </div>
  );
}
