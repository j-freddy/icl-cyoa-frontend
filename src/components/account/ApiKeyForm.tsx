import {
  ActionIcon,
  Button,
  Group,
  Textarea,
} from "@mantine/core";
import { IconEdit } from "@tabler/icons";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectApiKey, updateApiKey } from "../../features/accountSlice";


function ApiKeyForm() {

  const dispatch = useAppDispatch();

  const apiKey = useAppSelector(selectApiKey);

  const [key, setKey] = useState(apiKey);
  const [editable, setEditable] = useState(false);


  useEffect(
    () => {
      setKey(apiKey);
    },
    [apiKey]
  );


  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setKey(event.target.value);
  };

  const onIconClick = (): void => {
    setEditable(true);
  }

  const onApiKeyChange = () => {
    setEditable(false);
    dispatch(updateApiKey(key))
  }


  return (
    <Group align="center" position="apart">
      <Textarea
        label={"API Key"}
        value={key}
        mb="lg"
        disabled={!editable}
        onChange={handleTextChange}
        autosize
      />
      {
        editable
          ?
          <Button onClick={onApiKeyChange}>
            Change API Key
          </Button>
          :
          <ActionIcon
            variant="filled"
            size="md"
            color="blue"
            onClick={onIconClick}
          >
            <IconEdit size={20} />
          </ActionIcon>
      }
    </Group>
  );
}

export default ApiKeyForm;