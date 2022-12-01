import { useAppDispatch } from "../../app/hooks";
import { saveGraph } from "../../features/storySlice";
import { Button } from "@mantine/core";
import { IconDeviceFloppy } from "@tabler/icons";


export default function Saver() {

  const dispatch = useAppDispatch();

  return (
    <Button rightIcon={<IconDeviceFloppy size={20} />}
      onClick={() => { dispatch(saveGraph()); }}>
      Save
    </Button>
  );
}
