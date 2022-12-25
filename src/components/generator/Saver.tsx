import { useAppDispatch } from "../../store/hooks";
import { saveGraph } from "../../store/features/storySlice";
import { Button } from "@mantine/core";
import { IconDeviceFloppy } from "@tabler/icons";


export default function Saver() {

  const dispatch = useAppDispatch();

  return (
    <Button variant="gradient" gradient={{ from: 'teal', to: 'blue', deg: 60 }} rightIcon={<IconDeviceFloppy size={20} />}
      onClick={() => { dispatch(saveGraph()); }}>
      Save
    </Button>
  );
}
