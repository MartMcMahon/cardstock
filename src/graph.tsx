import { useEffect } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { useSelect } from "./hooks/useSelect";

const Graph = () => {
  const { searchResults } = useSelect((state) => state.scryfall);
  const { price_history } = useSelect((state) => state.api);

  useEffect(() => {
    console.log("price_history", price_history);
  }, [price_history]);

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
