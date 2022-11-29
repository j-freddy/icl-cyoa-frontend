import { Select } from '@mantine/core';
import { GenreOption } from '../../pages/initialInput/InitialInput';

interface GenreDropdownProps {
  options: GenreOption[];
  genre: string;
  setGenre: React.Dispatch<React.SetStateAction<string>>;
  id?: string;
}

const GenreDropdown = (props: GenreDropdownProps) => {
  return (
    <Select
      placeholder="Select a genre"
      clearable
      size="md"
      shadow='xl'
      onSearchChange={props.setGenre}
      searchValue={props.genre}
      nothingFound="No options"
      data={props.options}
      id={props.id}
    />
  )
};

export default GenreDropdown;
