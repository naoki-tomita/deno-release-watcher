import React, {
  createElement,
  FC,
  Fragment,
} from "https://esm.sh/react@19.1.1";
import { fetchItem } from "../lib/client.ts";
import { render, Renderer } from "jsr:@deno/gfm";
const h = createElement;

export const ItemPage: FC<{ tagName: string }> = ({ tagName }) => {
  return <Item tagName={tagName} />;
};

class MyRenderer extends Renderer {
  override text(text: string): string {
    return text.replace(/#\d+/g, (match) => 
      `<a href="${this.baseUrl}/issues/${match.slice(1)}">${match}</a>`
  );
  }
}

const renderer = new MyRenderer({ baseUrl: "https://github.com/denoland/deno" });
const Item: FC<{ tagName: string }> = async ({ tagName }) => {
  const release = await fetchItem(tagName);
  return (
    <Fragment>
      <h2>
        <a href={release!.html_url}>{release!.name}</a>
      </h2>
      <p>published at: {release!.published_at}</p>
      <code dangerouslySetInnerHTML={{ __html: render(release!.body, { renderer, breaks: true }) }} />
    </Fragment>
  );
};
