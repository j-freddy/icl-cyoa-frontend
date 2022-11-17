import { StoryNode } from "../graph/types";

// Max chars per line
const MAX_CHARS = 80

/*
  boxString("Hello world!")
  return:
+------------------------------------------------------------------------------+
| Hello world!                                                                 |
+------------------------------------------------------------------------------+
*/
export function boxString(str: String): string {
  let box = "+".padEnd(MAX_CHARS - 1, "-") + "+\n";
  box += `| ${str}`.padEnd(MAX_CHARS - 1, " ") + "|\n";
  box += "+".padEnd(MAX_CHARS - 1, "-") + "+";
  return box;
}

export const parseStoryToText = (story: StoryNode[]): string[] => {
  const text: string[] = [];

  for (const node of story) {
    let textSection: string = "";

    // Section title
    textSection += `${boxString(`Section ${node.sectionId}`)}\n\n`;

    // Section paragraph
    textSection += `${node.paragraph}\n\n`;

    // Section actions
    const numChoices = node.actions.length;

    if (numChoices) {
      textSection += `You have ${numChoices} choices:\n`;
      for (let i = 0; i < numChoices; i++) {
        textSection += `  - ${node.actions[i]}\n`;
        textSection += `    [Go to Section ${node.childrenSectionIds[i]}]\n`;
      }

      textSection += "\n\n";
    }

    text.push(textSection);
  }

  return text;
};
