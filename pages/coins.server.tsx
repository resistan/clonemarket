import { resolve } from "path";
import { Suspense } from "react";

const cache: any = {};
function fetchData(url: string) {
  if (!cache[url]) {
    throw Promise.all([
      fetch(url)
        .then((r) => r.json())
        .then((json) => (cache[url] = json)),
      new Promise((resolve) =>
        setTimeout(resolve, Math.round(Math.random() * 10000))
      ),
    ]);
  }
  return cache[url];
}
function Coin({ id, name, symbol }: any) {
  const {
    quotes: {
      USD: { price },
    },
  } = fetchData(`https://api.coinpaprika.com/v1/tickers/${id}`);
  // console.log(price);
  return (
    <>
      {name} / {symbol}: ${price}
    </>
  );
}
function List() {
  const coins = fetchData("https://api.coinpaprika.com/v1/coins");
  // console.log(coins);
  return (
    <ul>
      {coins.slice(0, 10).map((coin: any) => (
        <li key={coin.id}>
          <Suspense fallback={`Coin ${coin.name} is loading`}>
            <Coin {...coin} />
          </Suspense>
        </li>
      ))}
    </ul>
  );
}

export default function Coins() {
  return (
    <div>
      <h1>Welcome to Server Components</h1>
      <Suspense fallback="Rendering in server...">
        <List />
      </Suspense>
    </div>
  );
}

export const config = {
  runtime: "edge",
};
