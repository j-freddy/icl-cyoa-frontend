import { StoryNode } from "../graph/types";
import {
  AlignmentType,
  Document,
  IParagraphStyleOptions,
  ISectionOptions,
  PageBreak,
  Paragraph,
  TextRun
} from "docx";

// https://docx.js.org/

const myParagraphStyles: IParagraphStyleOptions[] = [
  {
    id: "sectionTitle",
    name: "Section Title",
    // Default
    basedOn: "Normal",
    next: "Normal",
    quickFormat: true,
    // Text
    run: {
      size: 72, // font-size: 36
      bold: true,
    },
    // Paragraph
    paragraph: {
      alignment: AlignmentType.CENTER,
      spacing: {
        before: 160,
        after: 640,
      },
    }
  },
  {
    id: "sectionParagraph",
    name: "Section Paragraph",
    // Default
    basedOn: "Normal",
    next: "Normal",
    quickFormat: true,
    // Text
    run: {
      size: 28 // font-size: 14
    },
    // Paragraph
    paragraph: {
      spacing: {
        line: 300,
        after: 300,
      },
    }
  },
  {
    id: "actionParagraph",
    name: "Action Paragraph",
    // Default
    basedOn: "Normal",
    next: "Normal",
    quickFormat: true,
    // Text
    run: {
      size: 28 // font-size: 14
    },
    // Paragraph
    paragraph: {
      spacing: {
        line: 300,
      },
    },
  },
];


function createSectionTitle(text: string): Paragraph {
  return new Paragraph({
    text: text,
    style: "sectionTitle",
  });
}

function createSectionParagraph(text: string): Paragraph {
  return new Paragraph({
    text: text,
    style: "sectionParagraph"
  });
}

function createActionParagraph(text: string): Paragraph {
  return new Paragraph({
    text: text,
    style: "actionParagraph",
    bullet: {
      level: 0,
    },
  });
}

function createActionRedirect(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: text,
        italics: true,
      })
    ],
    style: "actionParagraph",
    indent: {
      left: 720,
    },
  });
}

function pageBreak(): Paragraph {
  return new Paragraph({
    children: [new PageBreak()],
  })
}

function main(story: StoryNode[], indexCache: number[]): ISectionOptions {
  const paragraphs: Paragraph[] = [];

  // Section
  for (const node of story) {
    // Section title
    paragraphs.push(createSectionTitle(`Section ${node.sectionId}`));

    // Section paragraph
    paragraphs.push(createSectionParagraph(node.paragraph));

    // Section actions
    const numChoices = node.actions.length;

    if (numChoices) {
      for (let i = 0; i < numChoices; i++) {
        paragraphs.push(createActionParagraph(node.actions[i]));

        const sectionId = node.childrenSectionIds[i];
        if (sectionId !== null) {
          // + 1 to move from 0-indexed to 1-indexed
          paragraphs.push(
            createActionRedirect(`Go to Section ${sectionId}`
              + ` (Page ${indexCache[sectionId - 1] + 1})`)
          );
        }
      }
    }

    paragraphs.push(pageBreak());
  }

  return {
    properties: {},
    children: paragraphs,
  };
}

export function createDocx(story: StoryNode[], indexCache: number[]): Document {
  return new Document({
    sections: [
      main(story, indexCache)
    ],
    styles: {
      paragraphStyles: myParagraphStyles,
    }
  });
}
