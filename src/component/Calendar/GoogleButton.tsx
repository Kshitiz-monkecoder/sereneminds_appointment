import { Button, ButtonProps } from '@mantine/core';



export function ContinueButton(props: ButtonProps & React.ComponentPropsWithoutRef<'button'>) {
  return <Button  variant="default" {...props} />;
}
