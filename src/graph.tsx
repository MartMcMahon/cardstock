import { LineChart } from "@mui/x-charts/LineChart";
import { useSelect } from "./hooks/useSelect";

const Graph = () => {
  const { searchResults } = useSelect((state) => state.scryfall);

  return (
    <LineChart
      xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
      series={[
        {
          data: [2, 5.5, 2, 8.5, 1.5, 5],
        },
      ]}
      width={400}
      height={350}
      sx={{ pointerEvents: searchResults ? "none" : "auto" }}
    />
  );
};

export default Graph;
