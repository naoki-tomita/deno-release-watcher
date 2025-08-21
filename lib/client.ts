export type Release = {
  html_url: string;
  tag_name: string;
  name: string;
  created_at: string;
  published_at: string;
  body: string;
};

export const kv = await Deno.openKv();

export async function fetchList() {
  const list = kv.list<Release>({ prefix: releasesKey() });
  return (await Array.fromAsync(list)).map((it) => it.value);
}

export async function fetchItem(tagName: string) {
  const item = await kv.get<Release>(releaseKey(tagName));
  return item.value;
}

export function releaseKey(tagName: string) {
  return ["owner", "denoland", "repo", "deno", "releases", tagName];
}

export function releasesKey() {
  return ["owner", "denoland", "repo", "deno", "releases"];
}