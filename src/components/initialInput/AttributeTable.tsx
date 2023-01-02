import { Button, TextInput, Table, ActionIcon, Group, Container, Stack, Center } from '@mantine/core';
import './AttributeTable.css';
import { IconTrash, IconNewSection } from '@tabler/icons';
import { useAppDispatch } from '../../store/hooks';
import { addEntry, removeEntry, setAttribute, setContent } from '../../store/features/initialInputSlice';

interface AttributeTableProps {
  values: { attribute: string, content: string }[]
  setAttribute: (position: number, data: string) => void
  setContent: (position: number, data: string) => void
  removeEntry: (position: number) => void
  addEntry: () => void
}

const AttributeTable = (props: AttributeTableProps) => {

  const dispatch = useAppDispatch();


  const onSetAttribute = (position: number, data: string) => {
    dispatch(setAttribute({ position, data }));
  }

  const onSetContent = (position: number, data: string) => {
    dispatch(setContent({ position, data }));
  }

  const onRemoveEntry = (position: number) => {
    dispatch(removeEntry({ position }));
  }

  const onAddEntryClick = () => {
    dispatch(addEntry());
  }


  return (
    <>
      <Table className="spacing" captionSide="bottom">
        <thead>
          <tr>
            <th>Attribute</th>
            <th>Value</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {props.values.map((v, i) => (
            <tr>
              <th>
                <TextInput
                  value={v.attribute}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    onSetAttribute(i, event.currentTarget.value)
                  }
                />
              </th>
              <th><TextInput
                value={v.content}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  onSetContent(i, event.currentTarget.value)
                }
              />
              </th>
              <th>
                <ActionIcon variant="filled" color="red">
                  <IconTrash
                    onClick={() => onRemoveEntry(i)}
                  />
                </ActionIcon>
              </th>
            </tr>
          ))}
        </tbody>
        <caption>
          <Group position="right" mr={15}>
            <Button
              color="green.7"
              leftIcon={<IconNewSection />}
              onClick={onAddEntryClick}>
              Add Attribute
            </Button>
          </Group>
        </caption>
      </Table>


    </>
  );
}

export default AttributeTable;
