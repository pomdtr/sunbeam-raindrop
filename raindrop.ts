import type * as sunbeam from "npm:sunbeam-types";

if (Deno.args.length === 0) {
  const manifest: sunbeam.Manifest = {
    title: "Raindrop",
    commands: [
      {
        title: "Search Bookmarks",
        name: "search-bookmarks",
        mode: "view",
      },
    ],
  };
  console.log(JSON.stringify(manifest));
  Deno.exit(0);
}

const raindropToken = Deno.env.get("RAINDROP_TOKEN");
if (!raindropToken) {
  throw new Error("RAINDROP_TOKEN is not set");
}

if (Deno.args[0] == "search-bookmarks") {
  const resp = await fetch("https://api.raindrop.io/rest/v1/raindrops/0", {
    headers: {
      Authorization: `Bearer ${raindropToken}`,
    },
  });

  const { items: bookmarks } = await resp.json();

  const items: sunbeam.ListItem[] = bookmarks.map((bookmark: any) => ({
    title: bookmark.title,
    subtitle: bookmark.domain,
    actions: [
      {
        title: "Open URL",
        onAction: {
          type: "open",
          target: bookmark.link,
          exit: true,
        },
      },
      {
        title: "Copy URL",
        key: "c",
        onAction: {
          type: "copy",
          text: bookmark.link,
          exit: true,
        },
      },
    ],
  }));
  const list: sunbeam.List = { type: "list", items };

  console.log(JSON.stringify(list));
}
