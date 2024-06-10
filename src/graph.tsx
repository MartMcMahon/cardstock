import { useEffect, useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { useSelect } from "./hooks/useSelect";

const Graph = () => {
  const { simple_price } = useSelect((state) => state.main);
  const { searchResults } = useSelect((state) => state.scryfall);
  const { price_history } = useSelect((state) => state.api);

  const [series, setSeries] = useState<{ prices: number[]; dates: number[] }>({
    prices: [],
    dates: [],
  });

  useEffect(() => {
    console.log("price_history", price_history);
  }, [price_history]);

  useEffect(() => {
    const prices = [simple_price];
    const dates = [0];
    for (let i = 1; i < 30; i++) {
      prices.push((Math.random() -0.5) + prices[i-1]);
      dates.push(i);
    }
    prices[prices.length-1] = simple_price;
    setSeries({ prices, dates });
  }, [simple_price]);

  return (
    <LineChart
      xAxis={[{ data: series.dates }]}
      series={[
        {
          data: series.prices,
        },
      ]}
      width={400}
      height={350}
      sx={{ pointerEvents: searchResults ? "none" : "auto" }}
    />
  );
};

export default Graph;
