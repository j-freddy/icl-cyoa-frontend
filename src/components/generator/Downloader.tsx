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
import { IconFileDownload } from "@tabler/icons";

const useStyles = createStyles((theme) => ({

  popover: {
    background: theme.white
  },

}));


const generateTxtFile = (story: StoryNode[]): void => {
  const text: string[] = parseStoryToText(story);

  const element = document.createElement("a");
  const file = new Blob(text, { type: 'text/plain' });
  element.href = URL.createObjectURL(file);
  element.download = "story.txt";
  document.body.appendChild(element);
  element.click();
  console.log("Text document created successfully");
  document.body.removeChild(element);
};

const generateDocxFile = (story: StoryNode[]): void => {
  const doc = createDocx(story);

  Packer
    .toBlob(doc)
    .then((blob: Blob) => {
      saveAs(blob, "story.docx");
      console.log("Docx document created successfully");
    });
}


interface DownloaderProps {
  story: StoryNode[];
}
export default function Downloader(props: DownloaderProps) {
  const { classes } = useStyles();

  return (
    <Popover trapFocus position="bottom" withArrow shadow="md">
      <Popover.Target>
        <Button rightIcon={<IconFileDownload size={20} />}>
          Download
        </Button>
      </Popover.Target>
      <Popover.Dropdown className={classes.popover}>
        <Stack spacing="xs">
          <Button variant="subtle" color="dark" compact onClick={() => generateTxtFile(props.story)}>
            as .txt

          </Button>

          <Divider />

          <Button variant="subtle" color="dark" compact onClick={() => generateDocxFile(props.story)}>
            as .docx
          </Button>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}
