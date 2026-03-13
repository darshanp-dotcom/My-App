import { NextResponse } from "next/server";

type RssItem = {
  title: string;
  link: string;
  pubDate?: string;
};

const FEED_URL = "https://news.dunkindonuts.com/rss.xml";

export async function GET() {
  try {
    const res = await fetch(FEED_URL, {
      // Cache on the server for 1 hour; fine for "daily" news.
      next: { revalidate: 60 * 60 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { items: [], error: "Failed to fetch Dunkin RSS feed." },
        { status: 502 }
      );
    }

    const xml = await res.text();

    const items: RssItem[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match: RegExpExecArray | null;

    // Parse a handful of items from the feed.
    while ((match = itemRegex.exec(xml)) && items.length < 10) {
      const itemXml = match[1];

      const titleMatch =
        itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) ??
        itemXml.match(/<title>(.*?)<\/title>/);
      const linkMatch = itemXml.match(/<link>(.*?)<\/link>/);
      const dateMatch = itemXml.match(/<pubDate>(.*?)<\/pubDate>/);

      const title =
        (titleMatch?.[1] ?? titleMatch?.[0]?.replace(/<\/?title>/g, "") ?? "")
          .trim() || "";
      const link = (linkMatch?.[1] ?? "").trim();
      const pubDate = dateMatch?.[1]?.trim();

      if (title && link) {
        items.push({ title, link, pubDate });
      }
    }

    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json(
      { items: [], error: "Unexpected error fetching Dunkin news." },
      { status: 500 }
    );
  }
}

