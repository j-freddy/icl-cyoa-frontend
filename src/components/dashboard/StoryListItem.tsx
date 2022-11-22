import './StoryListItem.css';
import { ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';


interface StoryListItemProps {
    storyId: string,
    name: string,
}

export default function StoryListItem(props: StoryListItemProps) {
    const navigate = useNavigate();

    return (
    <ListGroup.Item onClick={() => {
        navigate("/generator/" + props.storyId);
        }}>
        <div className="fw-bold">{props.name}</div>
    </ListGroup.Item>
    );
}
