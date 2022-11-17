import React, { DOMAttributes } from "react";
import { Dropdown, ListGroup, Button } from "react-bootstrap";
import { StoryNode } from "../../utils/graph/types";
import { parseStoryToText } from "../../utils/downloader/txtUtils";
import './Downloader.css'
import { createDocx } from "../../utils/downloader/docxUtils";
import { Packer } from "docx";
import { saveAs } from "file-saver";

interface DownloaderProps {
  story: StoryNode[];
}

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

const MyDropdown = React.forwardRef<any, DOMAttributes<any>>(({ children, onClick }, ref) => (
  <Button
    ref={ref}
    variant="light"
    onClick={(e) => {
      e.preventDefault();
      onClick?.(e);
    }}
  >
    Download story
  </Button>
));

export default function Downloader(props: DownloaderProps) {
  return (
    <div className="downloader-container">
      <Dropdown align={"end"} className="downloader-button">
        <Dropdown.Toggle as={MyDropdown} variant="secondary"></Dropdown.Toggle>

        <Dropdown.Menu>
          <ListGroup variant="flush">
            <ListGroup.Item
              className='download-type'
              action
              as={"button"}
              onClick={() => generateTxtFile(props.story)}
            >
              as .txt
            </ListGroup.Item>
            <ListGroup.Item
              className='download-type'
              action
              as={"button"}
              onClick={() => generateDocxFile(props.story)}
            >
              as .docx
            </ListGroup.Item>
          </ListGroup>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
