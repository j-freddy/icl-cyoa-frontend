import {
  Center,
  Footer,
  Text
} from '@mantine/core';

export default function AppFooter() {

  return (
    <Footer
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
