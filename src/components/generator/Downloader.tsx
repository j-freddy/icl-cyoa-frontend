import { StoryNode } from "../../utils/graph/types";
import { parseStoryToText } from "../../utils/downloader/txtUtils";
import { createDocx } from "../../utils/downloader/docxUtils";
import { Packer } from "docx";
import { saveAs } from "file-saver";
import {
  Button,
  Popover,
  Stack,
  Divider,
  createStyles
} from "@mantine/core";
import { IconDownload, IconFileDownload } from "@tabler/icons";
import { ShuffledList, shuffleList } from "../../utils/utils";
import { selectStoryTitle } from "../../store/features/storySlice";
import { useAppSelector } from "../../store/hooks";

const useStyles = createStyles((theme) => ({

  popover: {
    background: theme.white
  },

}));

const shuffleStory = (story: StoryNode[]): ShuffledList<StoryNode> => {
  if (story.length <= 1) {
    return {
      list: story,
      // Index cache will not be used for story length <= 1
      indexCache: [],
    };
  }

  const head = story[0];
  const tail = story.slice(1, story.length);

  const shuffledList = shuffleList(tail);

  const newTail = shuffledList.list;
  // + 1 to make space for Head
  const cache = shuffledList.indexCache.map(i => i + 1);

  console.log([0].concat(cache));

  return {
    list: [head].concat(newTail),
    // Head is not shuffled
    indexCache: [0].concat(cache),
  };
};

const generateTxtFile = (story: StoryNode[], storyTitle: string,
  shuffle=false): void => {
  if (shuffle && story.length > 0) {
    story = shuffleStory(story).list;
  }

  const text: string[] = parseStoryToText(story);

  const element = document.createElement("a");
  const file = new Blob(text, { type: 'text/plain' });
  element.href = URL.createObjectURL(file);
  element.download = `${storyTitle}.txt`;
  document.body.appendChild(element);
  element.click();
  console.log("Text document created successfully");
  document.body.removeChild(element);
};

const generateDocxFile = (story: StoryNode[], storyTitle: string,
  shuffle=false): void => {
  let indexCache = [0];

  if (shuffle && story.length > 0) {
    const shuffledStory = shuffleStory(story);
    story = shuffledStory.list;
    indexCache = shuffledStory.indexCache;
  }

  const doc = createDocx(story, indexCache);

  Packer
    .toBlob(doc)
    .then((blob: Blob) => {
      saveAs(blob, `${storyTitle}.docx`);
      console.log("Docx document created successfully");
    });
}


interface DownloaderProps {
  story: StoryNode[];
}
export default function Downloader(props: DownloaderProps) {
  const { classes } = useStyles();
  const storyTitle = useAppSelector(selectStoryTitle);

  return (
    <Popover trapFocus position="bottom" withArrow shadow="md">
      <Popover.Target>
        <Button style={{width: "40%"}}>
        <IconDownload/>
        </Button>
      </Popover.Target>
      <Popover.Dropdown className={classes.popover}>
        <Stack spacing="xs">
          <Button variant="subtle" color="dark" compact onClick={() => generateDocxFile(props.story, storyTitle, true)}>
            as .docx
          </Button>

          <Divider />

          <Button variant="subtle" color="dark" compact onClick={() => generateTxtFile(props.story, storyTitle, true)}>
            as .txt
          </Button>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}
