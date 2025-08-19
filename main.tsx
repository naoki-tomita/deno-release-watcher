import { createElement, Fragment } from "https://esm.sh/react@18.2.0";
import { renderToReadableStream } from "https://esm.sh/react-dom@18.2.0/server";

const h = createElement;
const kv = Deno.openKv();

Deno.serve(async () => {
  const html = await renderToReadableStream(<App />);
  return new Response(html);
});

const App = () => {
  return (
    <Fragment>
      <header>
        <h1>KV App</h1>
      </header>
      <main></main>
      <footer>
        <p><a href="https://share-eel-51.deno.dev">here</a></p>
      </footer>
    </Fragment>
  );
}

Deno.cron("sample cron", "* * * * *", async () => {
  const releases = await fetch("https://api.github.com/repos/denoland/deno/releases").then(it => it.json());
});