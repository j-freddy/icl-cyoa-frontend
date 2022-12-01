import { StoryNode } from "../../utils/graph/types";
import {
  Text,
  List,
  ScrollArea,
  createStyles,
  Title,
  Stack,
} from '@mantine/core';
import NarrativeSection from "./section/NarrativeSection";
import ActionSection from "./section/ActionSection";


const useStyles = createStyles((theme) => ({

  scroll_area: {
    backgroundColor: theme.white,
    height: 320,
    borderRadius: 5,
    marginTop: 8,
    marginBottom: 8,
  },

  stack: {
    padding: 28
  },

  paragraph_title: {
    color: theme.colors.black,
  },

  actions_list: {
    marginLeft: 50,
  },

}));


export interface StorySectionProps extends StoryNode { };

function StorySection (props: StorySectionProps) {
  const { classes } = useStyles();

  const ListOfActions = () => {
    return (
      <List spacing="xs" className={classes.actions_list}>
        {
          props.actions?.map((action, index) => {
            return (
              <List.Item key={index}>
                <ActionSection action={action} nodeId={props.childrenIds[index]} />
              </List.Item>
            )
          })
        }
      </List>
    );
  }

  return (
    <ScrollArea type="always" className={classes.scroll_area}>

      <Stack spacing="sm" className={classes.stack}>
        <Text>
          <Title order={2} className={classes.paragraph_title}>
            Section {props.sectionId}
          </Title>
          <Text fz="sm" c="dimmed" fs="italic">Section paragraph and list of actions. </Text>
        </Text>
        <NarrativeSection {...props} />
        <ListOfActions />

      </Stack>

    </ScrollArea>
  );
};

export default StorySection;
