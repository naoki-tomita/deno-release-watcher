import React, {
  createElement,
  FC,
  Fragment,
} from "https://esm.sh/react@19.1.1";
import { renderToReadableStream } from "https://esm.sh/react-dom@19.1.1/server";
import { ListPage } from "./pages/List.tsx";
import { Document } from "./components/Document.tsx";
import { Router } from "./components/Router.tsx";
import { ItemPage } from "./pages/Item.tsx";
import "./cronjob.ts";

const h = createElement;

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const html = await renderToReadableStream(
    <Document>
      <App path={url.pathname} />
    </Document>,
  );
  return new Response(html, { headers: { "content-type": "text/html" } });
});

const App: FC<{ path: string }> = ({ path }) => {
  return (
    <Fragment>
      <header>
        <h1><a href="/">KV App</a></h1>
      </header>
      <main>
        <Router
          path={path}
          routes={[
            {
              pathMatcher: (p) => p === "/" || p === "",
              Component: () => <ListPage />,
            },
            {
              pathMatcher: (p) => p.startsWith("/tags/"),
              params: (p) => ({ tagName: p.split("/").filter(Boolean).at(1)! }),
              Component: ({ tagName }) => (
                <ItemPage tagName={tagName} />
              ),
            },
          ]}
        />
      </main>
      <footer>
        <p>
          <a href="/">here</a>
        </p>
      </footer>
    </Fragment>
  );
};
