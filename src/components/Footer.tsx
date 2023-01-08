import {
  Center,
  createStyles,
  Footer,
  Text
} from '@mantine/core';

const useStyles = createStyles((theme) => ({
  footer: {
    backgroundColor: theme.fn.rgba(theme.black, 0.08),
  },
}));

export default function AppFooter() {

  const { classes } = useStyles();

  return (
    <Footer
      className={classes.footer}
      height={"8vh"}
      p="md"
    >
      <Center>
        <Text fw={400}>
          CYOA Story Generator
        </Text>
      </Center>
    </Footer >
  );
}
