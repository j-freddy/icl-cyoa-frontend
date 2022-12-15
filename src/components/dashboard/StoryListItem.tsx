import {
  Card,
  Text,
  Badge
} from '@mantine/core'
import { useNavigate } from 'react-router-dom';
import { GENERATOR_PAGE } from '../../utils/pages';

interface StoryListItemProps {
  storyId: string,
  name: string,
  firstParagraph: string,
  totalSections: number,
}

export default function StoryListItem(props: StoryListItemProps) {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => {
        navigate(GENERATOR_PAGE + props.storyId);
      }}
      shadow="md"
      radius="md"
      withBorder
    >

      <Text mt="xs" mb="xs" fz="xl" weight={600} color="dark.7">
        {props.name}
      </Text>

      <Text size="sm" color="dimmed" mb="xs" lineClamp={3}>
        {props.firstParagraph}
      </Text>

      <Badge color={props.totalSections === 0 ? "red" : "indigo"} variant="outline">
        Total Sections: {props.totalSections}
      </Badge>
    </Card>
  );
}
