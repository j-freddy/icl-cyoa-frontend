import { List, Popover, Text } from "@mantine/core";
import { selectApiKey } from "../../store/features/accountSlice";
import { generateInitialStory } from "../../store/features/initialInputSlice";
import { generateInitialStoryBasic, initStory } from "../../store/features/storySlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import AttributeTable from "./AttributeTable";
import GenerateButton from "./GenerateButton";
import { GenreOption } from "./GenreOptions";
import InputTextForm from "./InputTextForm";


interface GenreHandlerProps {
  genre: string,
}

function GenreHandler(props: GenreHandlerProps) {

  const dispatch = useAppDispatch();


  const handleGenerateGenreText = (genre: string) => {
    const generateGenrePrompt = `Write a ${genre} story from a second person perspective.`;

    dispatch(initStory()).unwrap().then(() =>
      dispatch(generateInitialStoryBasic({ prompt: generateGenrePrompt })));
  };

  const handleGenerateInitialStory = () => {
    dispatch(initStory()).unwrap().then(() =>
      dispatch(generateInitialStory()));
  };

  switch (props.genre) {
    case GenreOption.None:
      return (
        <Popover width={200} position="bottom" withArrow shadow="md">
          <Popover.Target>
            <div>
              <GenerateButton
                className="generate-button"
                color="gray"
              />
            </div>
          </Popover.Target>

          <Popover.Dropdown>
            <Text size="sm">Select a genre first before starting story generation.</Text>
          </Popover.Dropdown>
        </Popover>
      );

    case GenreOption.Custom:
      return (<InputTextForm />);

    case GenreOption.Advanced:
      return (
        <>
          <Text fz="sm">
            <Text fw={500}>
              For Example:
            </Text>

            <List size="sm">
              <List.Item> theme: fantasy, jolly</List.Item>
              <List.Item> character: knight, dragon</List.Item>
              <List.Item>items: green sword</List.Item>
            </List>
          </Text>
          <AttributeTable />

          <GenerateButton onClick={() => { handleGenerateInitialStory() }} />
        </>
      );

    default:
      return (
        <GenerateButton onClick={() => { handleGenerateGenreText(props.genre) }} />
      );
  }
}

export default GenreHandler;
