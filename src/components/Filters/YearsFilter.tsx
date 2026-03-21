import { Button, Group, Header, Input, FormItem } from "@vkontakte/vkui";
import { useState, useEffect } from "react";

interface YearsFilterProps {
  onApply: (from: string, to: string) => void;
  initialFrom?: string;
  initialTo?: string;
}

export const YearsFilter = ({
  onApply,
  initialFrom = "",
  initialTo = "",
}: YearsFilterProps) => {
  const [yearFrom, setYearFrom] = useState(initialFrom);
  const [yearTo, setYearTo] = useState(initialTo);

  useEffect(() => {
    setYearFrom(initialFrom);
    setYearTo(initialTo);
  }, [initialFrom, initialTo]);

  const isErrorFrom = yearFrom.length >= 4 && Number(yearFrom) < 1990;
  const isErrorTo = yearTo.length >= 4 && Number(yearTo) > 2027;
  const isRangeError = yearFrom && yearTo && Number(yearFrom) > Number(yearTo);

  return (
    <section>
      <Group style={{ width: "200px" }}>
        <Header>Год выпуска</Header>
        <FormItem>
          <Input
            status={isErrorFrom || isRangeError ? "error" : "default"}
            type="number"
            style={{ margin: "0 0 10px 0" }}
            placeholder="от 1990"
            min="1990"
            value={yearFrom}
            onChange={(event) => setYearFrom(event.target.value)}
          />
          <Input
            status={isErrorTo || isRangeError ? "error" : "default"}
            placeholder="до 2026"
            type="number"
            value={yearTo}
            onChange={(event) => setYearTo(event.target.value)}
          />
          <Button
            stretched
            style={{ margin: "20px 0 0 0" }}
            onClick={() => onApply(yearFrom, yearTo)}
            disabled={!!(isErrorFrom || isErrorTo || isRangeError)}
          >
            Применить
          </Button>
        </FormItem>
      </Group>
    </section>
  );
};
