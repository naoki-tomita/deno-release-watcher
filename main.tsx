import React, { createElement, Fragment, Suspense, use } from "https://esm.sh/react@19.1.1";
import { renderToReadableStream } from "https://esm.sh/react-dom@19.1.1/server";

const h = createElement;
const kv = await Deno.openKv();

Deno.serve(async () => {
  const html = await renderToReadableStream(<App />);
  return new Response(html, { headers: { "content-type": "text/html" } });
});

let listCache: Promise<Deno.KvEntry<Release>[]> | null = null;
function listData() {
  if (listCache) {
    return listCache;
  }
  const list = kv.list<Release>({ prefix: ["owner", "denoland", "repo", "deno", "releases"] });
  return listCache = Array.fromAsync(list);
}

const List = () => {
  const list = use(listData());
  return (
    <ul>
      {list.map(it => <li key={it.value.tag_name}>{it.value.name}</li>)}
    </ul>
  );
}


const App = () => {
  return (
    <Fragment>
      <header>
        <h1>KV App</h1>
      </header>
      <main>
        <Suspense fallback={<span>Loading...</span>}>
          <List />
        </Suspense>
      </main>
      <footer>
        <p><a href="https://share-eel-51.deno.dev">here</a></p>
      </footer>
    </Fragment>
  );
}

type Release = {
  html_url: string;
  tag_name: string;
  name: string;
  created_at: string;
  published_at: string;
  body: string;
}

Deno.cron("sample cron", "*/10 * * * *", async () => {
  console.log("Crawling...");
  const releases: Release[] = await fetch("https://api.github.com/repos/denoland/deno/releases").then(it => it.json());
  const knownReleases = (await kv.get<string[]>(["owner", "denoland", "repo", "deno", "releases"])).value ?? [];

  await Promise.all(
    releases
      .filter(it => !knownReleases.includes(it.tag_name))
      .map(it => kv.set(["owner", "denoland", "repo", "deno", "releases", it.tag_name], it))
  );
  await kv.set(["owner", "denoland", "repo", "deno", "releases"], releases.map(it => it.tag_name));
  console.log(`Crawled count: ${releases.length}`);
});
