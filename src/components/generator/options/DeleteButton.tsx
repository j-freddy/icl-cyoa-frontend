import { Button, Popover } from "@mantine/core";
import { deleteNode } from "../../../store/features/storySlice";
import { useAppDispatch } from "../../../store/hooks";


interface DeleteButtonProps {
    nodeId: number
};


const DeleteButton = (props: DeleteButtonProps) => {

    const dispatch = useAppDispatch();

    return (
        <Popover position="bottom" withArrow shadow="md">
        <Popover.Target>
          <Button variant="outline" color={"red"}>Delete</Button>
        </Popover.Target>
        <Popover.Dropdown>
          <Button variant="subtle" onClick={() => dispatch(deleteNode(props.nodeId))}>
            Confirm: Delete
          </Button>
        </Popover.Dropdown>
      </Popover>
    );
}


export default DeleteButton;