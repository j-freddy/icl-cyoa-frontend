import { showNotification, updateNotification, } from "@mantine/notifications";
import { LoadingType } from "../../../utils/graph/types";
import { IconAlertTriangle, IconCheck, IconCross, IconError404 } from '@tabler/icons';
import { Progress, Tooltip } from "@mantine/core";

export type LoadingUpdate = {
  percentage: number,
  numNodesGenerated: number,
}

export const displayGenerateManyLoadingNotification = () => {
  showNotification({
    id: 'load-data',
    loading: true,
    title: "Generating many paragraphs and actions.",
    message: <Progress value={0} />,
    autoClose: false,
    disallowClose: true,
  });
};

export const displayGenerateManyUpdate = (loadingUpdate: LoadingUpdate) => {
  updateNotification({
    id: 'load-data',
    loading: true,
    title: "Generating many paragraphs and actions.",
    message: <Progress value={loadingUpdate.percentage} />,
    autoClose: false,
    disallowClose: true,
  });
};

export const displayLoadingNotification = (loadingType: LoadingType) => {
  
  const typeMessage = new Map<LoadingType, string>([
    [LoadingType.GenerateParagraph, "Generating paragraph."],
    [LoadingType.GenerateActions, "Generating actions."],
    [LoadingType.GenerateEnding, "Generating ending."],
    [LoadingType.ConnectingNodes, "Connecting nodes."],
    [LoadingType.InitialStory, "Generating initial story."],
    [LoadingType.GenerateMany, "Generating many paragraphs and actions."],
    [LoadingType.GenerateNewAction, "Generating new action."],
  ]);
  const message = typeMessage.get(loadingType);

  showNotification({
    id: 'load-data',
    loading: true,
    title: message,
    message: 'Please wait.',
    autoClose: false,
    disallowClose: true,
  });
}


export const displayLoadedNotification = (loadingType: LoadingType) => {

  const typeMessage = new Map<LoadingType, string>([
    [LoadingType.GenerateParagraph, "Paragraph was generated successfully."],
    [LoadingType.GenerateActions, "Actions were generated successfully."],
    [LoadingType.GenerateEnding, "Ending was generated successfully."],
    [LoadingType.ConnectingNodes, "Nodes were successfully connected."],
    [LoadingType.InitialStory, "Initial story was generated successfully."],
    [LoadingType.GenerateMany, "Many paragraphs and actions were generated successfully."],
    [LoadingType.GenerateNewAction, "Action was generated successfully."],
  ]);
  const message = typeMessage.get(loadingType);

  updateNotification({
    id: 'load-data',
    color: 'teal',
    title: message,
    message: 'You can close this notification now.',
    icon: <IconCheck size={16} />,
    autoClose: 1500,
  });
}

export const displayErrorUpdate = (message: string) => {
  updateNotification({
    id: 'load-data',
    color: 'red',
    title: message,
    message: 'Try again...',
    icon: <IconAlertTriangle size={16} />,
    autoClose: 1500,
  });
}

