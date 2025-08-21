import React, { createElement } from "https://esm.sh/react@19.1.1";
import { fetchList } from "../lib/client.ts";
const h = createElement;

export const ListPage = () => {
  return <List />;
};

const List = async () => {
  const list = await fetchList();
  return (
    <ul>
      {list.map((it) => 
        <li key={it.tag_name}>
          <a href={`/tags/${it.tag_name}`}>{it.name}</a>
        </li>
      )}
    </ul>
  );
};
