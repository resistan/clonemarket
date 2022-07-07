import { Suspense } from "react";

let finished = false;
function List() {
  if (!finished) {
    throw Promise.all([
      new Promise((resolve) => setTimeout(resolve, 3000)),
      new Promise((resolve) => {
        finished = true;
        resolve("");
      }),
    ]);
  }
  return <p>test</p>;
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
