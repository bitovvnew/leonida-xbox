export type Status = {
  boot: number;
  story: number;
  world: number;
  audio: number;
  online: number;
  xbox: number;
};

export type Post = {
  date: string; // yyyy-mm-dd
  time: string; // hh:mm utc
  title: string;
  body: string;
  type?: "reveal";
  s: Status;
  dec: number;
};

const REPO = "bitovvnew/leonida-xbox";
const START = Date.UTC(2026, 10, 24);

export const dayOf = (p: Post): number =>
  Math.round((Date.parse(p.date + "T00:00:00Z") - START) / 864e5) + 1;

export async function loadPosts(): Promise<Post[]> {
  const urls = [
    `https://raw.githubusercontent.com/${REPO}/main/posts.json?t=${Date.now()}`,
    "posts.json",
  ];
  for (const url of urls) {
    try {
      const r = await fetch(url, { cache: "no-store" });
      if (r.ok) return ((await r.json()) as Post[]).sort((a, b) => a.date.localeCompare(b.date));
    } catch {
      /* next mirror */
    }
  }
  return [];
}

export const latest = (posts: Post[]): Post | undefined => posts[posts.length - 1];
