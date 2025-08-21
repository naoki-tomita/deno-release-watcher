import { kv, Release, releaseKey, releasesKey } from "./lib/client.ts";

Deno.cron("sample cron", "*/10 * * * *", async () => {
  console.log("Crawling...");
  const releases: Release[] = await fetch(
    "https://api.github.com/repos/denoland/deno/releases",
  ).then((it) => it.json());
  const knownReleases =
    (await kv.get<string[]>(releasesKey()))
      .value ?? [];

  await Promise.all(
    releases
      .filter((it) => !knownReleases.includes(it.tag_name))
      .map((it) => kv.set(releaseKey(it.tag_name), it,)),
  );
  await kv.set(
    releasesKey(),
    releases.map((it) => it.tag_name),
  );
  console.log(`Crawled count: ${releases.length}`);
});
