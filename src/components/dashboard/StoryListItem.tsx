import { Card, Text, Badge, Group, Container, Button } from '@mantine/core'
import { useNavigate } from 'react-router-dom';
import { IconTrash } from '@tabler/icons';
import { GENERATOR_PAGE } from '../../utils/pages';
import { useAppDispatch } from '../../store/hooks';
import { deleteStory } from '../../store/features/accountSlice';

interface StoryListItemProps {
  storyId: string,
  name: string,
  firstParagraph: string,
  totalSections: number,
}

export default function StoryListItem(props: StoryListItemProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  return (
    <Card
      onClick={() => {
        navigate(GENERATOR_PAGE + props.storyId);
      }}
      shadow="md"
      radius="md"
      withBorder
    >

            <Group position="apart">
                <Text
                    mt="xs"
                    mb="xs"
                    fz="xl"
                    weight={600}
                    color="dark.7"
                    onClick={() => {
                        navigate("/generator/" + props.storyId);
                    }}
                >
                    {props.name}
                </Text>
                <Button
                    variant="light"
                    color="red"
                    rightIcon={<IconTrash />}
                    size="xs"
                    onClick={(e: React.MouseEvent) => {
                        dispatch(deleteStory(props.storyId));
                        e.stopPropagation();
                    }}
                >
                    Delete Story
                </Button>
            </Group>

            <Container px={0}
                onClick={() => {
                    navigate("/generator/" + props.storyId);
                }}
            >
                <Text size="sm" color="dimmed" mb="xs" lineClamp={3}>
                    {props.firstParagraph}
                </Text>

                <Badge color={props.totalSections === 0 ? "red" : "indigo"} variant="outline">
                    Total Sections: {props.totalSections}
                </Badge>
            </Container>
        </Card>
    );
}
