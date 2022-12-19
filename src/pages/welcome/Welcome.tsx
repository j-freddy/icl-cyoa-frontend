import { Button, Container, createStyles, Group, Image, Stack, Text, Title } from '@mantine/core';
import { IconCaretRight } from '@tabler/icons';
import { Link } from 'react-router-dom';
import '../../style/base.css';
import { INITIAL_INPUT_PAGE } from '../../utils/pages';


const useStyles = createStyles((theme, _params) => ({
  titleStack: {
    justifyContent: "center",
    align: "center",
    spacing: "xl",
    width: "100",
    height: "92vh",
    alignItems: "center"
  },

  title: {
    textAlign: "center",
    fontSize: 55,
    fontWeight: 700,
    width: "80vw",
    tracking: "tight",
    letterSpacing: "-1px",
    fontFamily: 'Greycliff CF, sans-serif',
  },

  subtitle: {
    variant: "gradient",
    textAlign: "center",
    fontSize: 18,
    color: theme.colors.dark[4],
    fontWeight: 80,
    fontFamily: 'Greycliff CF, sans-serif'
  },

  startButton: {

  },

  stackContent: {
    alignItems: "center",
    justifyContent: "center",
    spacing: "xl",
    width: "100",
    backgroundColor: "white",
  },

  group: {
    width: "100",
    height: "100vh",
    alignItems: "center",
    background: "white",
    padding: "10px"
  },

  textSubGroup: {
    width: "35vw"
  },

  endText: {
    fontSize: 40,
    fontWeight: 700,
    width: "80",
    tracking: "tight",
    letterSpacing: "-1px",
    fontFamily: 'Greycliff CF, sans-serif',
  }
}))

const WelcomeView = () => {
  const { classes } = useStyles();
  
  return (
    <>
      <Stack
        className={classes.titleStack}>
        <Text className={classes.title}>
          Choose Your Own Adventure Story Generator
        </Text>

        <Text className={classes.subtitle}>
          Quickly generate a complete, editable gamebook with a single prompt.
        </Text>

        <Link to={INITIAL_INPUT_PAGE}>
          <Button
            variant="filled"
            color="indigo.8"
            size="md"
            radius="md"
            rightIcon={<IconCaretRight size={25} />}
          >
            Get Started
          </Button>
        </Link>
      </Stack >

      <Stack
        className={classes.stackContent}>
        <Group className={classes.group}>

          <Container className={classes.textSubGroup}>
            <Title>
              Create AI-generated stories with the click of a button
            </Title>
          </Container>

          <Image
            radius="md"
            src="https://images.unsplash.com/photo-1511216335778-7cb8f49fa7a3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
            alt="Random unsplash image"
            width="35vw"
            fit="contain"
          />
        </Group>

        <Group className={classes.group}>
          <Image
            radius="md"
            src="https://images.unsplash.com/photo-1511216335778-7cb8f49fa7a3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
            alt="Random unsplash image"
            width="35vw"
            fit="contain"
          />

          <Container className={classes.textSubGroup}>
            <Title>
              Easily polish and reorganize your story
            </Title>
          </Container>

        </Group>
        <Group className={classes.group}>
          <Text
            variant="gradient"
            gradient={{ from: 'indigo.9', to: 'blue', deg: 45 }}
            className={classes.endText}
          >
            Start writing now.
          </Text>
        </Group>
      </Stack>

    </>
  );
};

export default WelcomeView;
