import "./Saver.css"
import { Button } from "react-bootstrap";
import { useAppDispatch } from "../../app/hooks";
import { saveGraph } from "../../features/storySlice";

export default function Saver() {

    const dispatch = useAppDispatch();

    return (
        <Button className="save-button" onClick={() => {
            dispatch(saveGraph());
        }}>
            Save
        </Button>
    );
}
