import { ActionIcon, Group, Select, Text } from '@mantine/core';
import { forwardRef, ReactElement } from 'react';

interface GenreDropdownProps {
  options: { value: string, icon?: ReactElement, description?: string }[];
  genre: string;
  setGenre: React.Dispatch<React.SetStateAction<string>>;
  id?: string;
}

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  value: string;
  icon?: ReactElement;
  description?: string;
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ value, icon, description, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <ActionIcon size="md">
          {icon}
        </ActionIcon>
        <div>
          <Text size="sm">{value}</Text>
          <Text size="xs" opacity={0.65}>
            {description}
          </Text>
        </div>


      </Group>
    </div>
  )
);

const GenreDropdown = (props: GenreDropdownProps) => {
  return (
    <Select
      placeholder="Select a genre"
      clearable
      size="md"
      shadow='xl'
      maxDropdownHeight={400}
      onSearchChange={props.setGenre}
      searchValue={props.genre}
      nothingFound="No options"
      data={props.options}
      itemComponent={SelectItem}
      id={props.id}
    />
  )
};

export default GenreDropdown;
