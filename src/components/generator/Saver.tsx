import { useAppDispatch } from "../../store/hooks";
import { saveGraph } from "../../store/features/storySlice";
import { Button } from "@mantine/core";


export default function Saver() {

  const dispatch = useAppDispatch();

  return (
    <Button variant="gradient" gradient={{ from: 'teal', to: 'blue', deg: 60 }} style={{width: "40%"}}
      onClick={() => { dispatch(saveGraph()); }}>
      Save
    </Button>
  );
}
