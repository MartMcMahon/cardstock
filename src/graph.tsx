import React, { useEffect } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { useSelect } from "./hooks/useSelect";

const fetchGoldfishPriceHistoryCSV = async (cardname, setCode) => {
  let name = cardname.replace(/ /g, "+");
  const url = `https://www.mtggoldfish.com/price-download/paper/${name}+%255B${setCode.toUpperCase()}%255D`;
  const response = await fetch(url);
  const text = await response.text();
  console.log(text);
};

const Graph = () => {
  const { selectedCard } = useSelect((state) => state);
  const [loadingChart, setLoadingChart] = React.useState(true);

  useEffect(() => {
    setLoadingChart(true);
    // download csv
    fetchGoldfishPriceHistoryCSV(selectedCard.name, selectedCard.set);
  }, [selectedCard]);

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
    />
  );
};

export default Graph;
