import { IconCaretRight } from "@tabler/icons";
import { Button } from '@mantine/core';

interface GenerateButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  color?: string;
  className?: string;
}

const GenerateButton = (props: GenerateButtonProps) => {
  return (
    <Button
      variant="filled"
      // color="indigo.8"
      size="md"
      radius="md"
      rightIcon={<IconCaretRight size={25} />}
      {...props}
    >
      Generate
    </Button>
  );
};

export default GenerateButton;
