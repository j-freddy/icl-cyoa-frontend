import { EditText, onSaveProps } from 'react-edit-text';
import 'react-edit-text/dist/index.css';

interface EditableNameProps {
    name: string,
    onSaveName: (value: string) => void,
}

export const EditableName = (props: EditableNameProps) => {
    const onSave = ({value}: onSaveProps) => {
        props.onSaveName(value)
    };

    return (
        <EditText defaultValue={props.name} showEditButton onSave={onSave} />
    );
}
