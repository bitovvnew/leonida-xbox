import type { Post, Status } from "./devlog";

const ROWS: [label: string, key: keyof Status][] = [
  ["boot / menus", "boot"],
  ["story", "story"],
  ["open world", "world"],
  ["radio + audio", "audio"],
  ["online p2p", "online"],
  ["xbox branch", "xbox"],
];

function Bar({ value, tone }: { value: number; tone: "g" | "y" | "r" | "d" }) {
  const filled = Math.round(value / 5);
  return (
    <span className={tone}>
      {"■".repeat(filled)}
      {"·".repeat(20 - filled)}
    </span>
  );
}

export function StatusBars({ post }: { post: Post }) {
  return (
    <pre className="status">
      {ROWS.map(([label, key]) => {
        const v = post.s[key];
        return (
          <div key={key}>
            {label.padEnd(16)} <Bar value={v} tone={v >= 90 ? "g" : v > 0 ? "y" : "d"} /> {v}%
          </div>
        );
      })}
      <div>
        {"\n"}
        {"quick_resume".padEnd(16)} <Bar value={post.dec} tone="r" /> {post.dec}% decrypted
      </div>
    </pre>
  );
}
