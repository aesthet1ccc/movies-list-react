import { useState, useEffect } from "react";
import { Button, Group, Header, Input, FormItem } from "@vkontakte/vkui";

interface RatingFilterProps {
  handleFilterRating: (from: string, to: string) => void;
  initialFrom?: string;
  initialTo?: string;
}

export const RatingFilter = ({
  handleFilterRating,
  initialFrom = "",
  initialTo = "",
}: RatingFilterProps) => {
  const [ratingFrom, setRatingFrom] = useState(initialFrom);
  const [ratingTo, setRatingTo] = useState(initialTo);

  useEffect(() => {
    setRatingFrom(initialFrom);
    setRatingTo(initialTo);
  }, [initialFrom, initialTo]);

  const isErrorValueFrom = ratingFrom.length > 3;
  const isErrorValueTo = ratingTo.length > 3;

  return (
    <section>
      <Group style={{ width: "200px" }}>
        <Header>Рейтинг</Header>
        <FormItem>
          <Input
            status={isErrorValueFrom ? "error" : "default"}
            type="text"
            style={{ margin: "0 0 10px 0" }}
            placeholder="0"
            value={ratingFrom}
            onChange={(event) => setRatingFrom(event.target.value)}
          />
          <Input
            status={isErrorValueTo ? "error" : "default"}
            placeholder="7.0"
            type="text"
            value={ratingTo}
            onChange={(event) => setRatingTo(event.target.value)}
          />
          <Button
            stretched
            style={{ margin: "20px 0 0 0" }}
            onClick={() => handleFilterRating(ratingFrom, ratingTo)}
          >
            Применить
          </Button>
        </FormItem>
      </Group>
    </section>
  );
};
