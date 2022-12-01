import { Button, TextInput, Table, ActionIcon, Group, Container, Stack, Center } from '@mantine/core';
import './AttributeTable.css';
import { IconTrash, IconNewSection } from '@tabler/icons';

interface AttributeTableProps {
    values: { attribute: string, content: string }[]
    setAttribute: (position: number, data: string) => void
    setContent: (position: number, data: string) => void
    removeEntry: (position: number) => void
    addEntry: () => void
}

const AttributeTable = (props: AttributeTableProps) => {
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
                            <th><TextInput value={v.attribute} onChange={(event) =>
                                props.setAttribute(i, event.currentTarget.value)} /></th>
                            <th><TextInput value={v.content} onChange={(event) =>
                                props.setContent(i, event.currentTarget.value)} /></th>
                            <th>
                                <ActionIcon variant="filled" color="red">
                                    <IconTrash onClick={() => props.removeEntry(i)} />
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
                            onClick={props.addEntry}>
                            Add Attribute
                        </Button>
                    </Group>
                </caption>
            </Table>


        </>
    );
}

export default AttributeTable;
