import { Checkbox, Group, Header } from "@vkontakte/vkui";

const genres = [
  "биография",
  "боевик",
  "военный",
  "детектив",
  "драма",
  "история",
  "комедия",
  "криминал",
  "приключения",
  "триллер",
  "фантастика",
];

interface GenresFilterProps {
  selectedGenres: string[];
  handleGenreChange: (str: string) => void;
}

export const GenresFilter = ({
  selectedGenres,
  handleGenreChange,
}: GenresFilterProps) => {
  return (
    <Group style={{ width: "200px" }} header={<Header>Жанры:</Header>}>
      {genres.map((genre) => (
        <Checkbox
          style={{ color: "#333333" }}
          key={genre}
          checked={selectedGenres.includes(genre)}
          onChange={() => handleGenreChange(genre)}
        >
          {genre}
        </Checkbox>
      ))}
    </Group>
  );
};
