import { useEffect, useRef, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "./App.css";

let scryfall_url = "https://api.scryfall.com/";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Chart.js Line Chart",
    },
  },
};

const labels = ["January", "February", "March", "April", "May", "June", "July"];
const d1 = labels.map(() => Math.random() * 100);
const d2 = labels.map(() => Math.random() * 100);

export const data = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      data: d1,
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    {
      label: "Dataset 2",
      data: d2,
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
};

function App() {
  const [cardNameInput, setCardNameInput] = useState("");
  const [card, setCard] = useState({});
  const [price, setPrice] = useState(0.0);
  const [username, setUsername] = useState("");
  const [cash, setCash] = useState(0.0);
  const [stocks, setStocks] = useState({});

  const server_url = "ws://localhost:8000";
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(server_url);
    ws.current.onopen = () => {
      console.log("connected");
    };
    ws.current.onclose = () => {
      console.log("disconnected");
    };

    return () => {
      ws.current.close();
    };
  }, []);

  useEffect(() => {
    if (!ws.current) return;
    ws.current.onmessage = (e) => {
      let data;
      try {
        data = JSON.parse(e.data);
        if (data.action === "userRes") {
          console.log(data);
          setCash(data.data.cash);
          setStocks(data.data.stocks);
        }
      } catch (e) {
        console.log("error parsing this", e.data);
        return console.log(e);
      }
    };
  }, [ws.current]);

  function getCard() {
    fetch(scryfall_url + "cards/search?q=" + cardNameInput)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.object === "list") {
          let d = data.data;
          console.log(d);
          setCard(d[0]);
          setPrice(d[0].prices.usd);
        }
      });
  }

  function randomCard() {
    fetch(scryfall_url + "cards/random")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setCard(data);
        setPrice(data.prices.usd);
      });
  }

  const submitUsername = () => {
    ws.current.send(
      JSON.stringify({
        action: "fetchUser",
        data: {
          id: username,
        },
      })
    );
  };

  const buy = () => {
    if (card.name === undefined) return;
    if (stocks[card.name] === undefined) {
      stocks[card.name] = { cost: price, amount: 1 };
    } else {
      stocks[card.name].cost =
        (parseFloat(stocks[card.name].cost) * stocks[card.name].amount +
          parseFloat(price)) /
        (stocks[card.name].amount + 1);
      stocks[card.name].amount += 1;
    }
    let newCash = cash - parseFloat(price);
    setStocks(stocks);
    setCash(newCash);

    console.log(stocks);
    ws.current.send(
      JSON.stringify({
        action: "setUser",
        data: { id: username, cash: cash, stocks: stocks },
      })
    );
  };

  const sell = () => {
    if (card.name === undefined) return;
    if (stocks[card.name] === undefined) return;
    if (stocks[card.name].amount === 0) return;

    (stocks[card.name].cost * stocks[card.name].amount - parseFloat(price)) /
      (stocks[card.name].amount - 1);
    stocks[card.name].amount -= 1;

    setStocks(stocks);
    setCash(parseFloat(cash) + parseFloat(price));

    ws.current.send(
      JSON.stringify(
        {
          action: "setUser",
          data: { id: username, cash, stocks },
        },
        ["name", "cost", "amount"]
      )
    );
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <input
          type="text"
          placeholder="user name"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
        <button onClick={submitUsername}>set username</button>
        <h2>cash: {cash}</h2>
        {Object.entries(stocks).map(([key, val]) => {
          console.log(key, val);
          return (
            <h3 key={key}>
              {key}: {val.amount} @ {val.cost}
            </h3>
          );
        })}
        <input
          type="text"
          value={cardNameInput}
          onChange={(e) => setCardNameInput(e.target.value)}
          placeholder="card name"
        />
        <button onClick={getCard}>search</button>
        <button onClick={randomCard}>random</button>
        {card.image_uris && (
          <img src={card.image_uris.normal} alt={card.name} width={"300px"} />
        )}
      </div>
      <div>
        <h2>Current: {price}</h2>
        <button onClick={buy}>BUY</button>
        <button onClick={sell}>SELL</button>
      </div>

      <Line options={options} data={data} />
    </>
  );
}

export default App;
