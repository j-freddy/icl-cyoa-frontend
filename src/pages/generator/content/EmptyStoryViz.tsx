import {
  Center,
  Loader,
  Text
} from '@mantine/core';


function EmptyStoryViz() {
  return (
    <Center>
      <Text fw={700} fz="lg" fs="italic">
        Generating the initial paragraph and options...
      </Text>
      <Loader />
    </Center>
  );
}


export default EmptyStoryViz;
