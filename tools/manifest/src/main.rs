//! leonida-manifest: walks a build directory and prints a size manifest.
//! usage: leonida-manifest <dir> [--json]

use std::env;
use std::fs;
use std::io;
use std::path::{Path, PathBuf};

#[derive(Debug)]
struct Entry {
    path: PathBuf,
    bytes: u64,
}

fn walk(root: &Path, dir: &Path, out: &mut Vec<Entry>) -> io::Result<()> {
    for item in fs::read_dir(dir)? {
        let item = item?;
        let p = item.path();
        let meta = item.metadata()?;
        if meta.is_dir() {
            walk(root, &p, out)?;
        } else {
            let rel = p.strip_prefix(root).unwrap_or(&p).to_path_buf();
            out.push(Entry { path: rel, bytes: meta.len() });
        }
    }
    Ok(())
}

fn human(bytes: u64) -> String {
    const UNITS: [&str; 5] = ["B", "K", "M", "G", "T"];
    let mut v = bytes as f64;
    let mut i = 0;
    while v >= 1024.0 && i < UNITS.len() - 1 {
        v /= 1024.0;
        i += 1;
    }
    if i == 0 { format!("{}{}", bytes, UNITS[0]) } else { format!("{:.1}{}", v, UNITS[i]) }
}

fn main() -> io::Result<()> {
    let args: Vec<String> = env::args().collect();
    let dir = args.get(1).map(PathBuf::from).unwrap_or_else(|| PathBuf::from("."));
    let json = args.iter().any(|a| a == "--json");

    let mut entries = Vec::new();
    walk(&dir, &dir, &mut entries)?;
    entries.sort_by(|a, b| b.bytes.cmp(&a.bytes));
    let total: u64 = entries.iter().map(|e| e.bytes).sum();

    if json {
        let rows: Vec<String> = entries
            .iter()
            .map(|e| format!("{{\"path\":\"{}\",\"bytes\":{}}}", e.path.display().to_string().replace('\\', "/"), e.bytes))
            .collect();
        println!("{{\"total\":{},\"files\":[{}]}}", total, rows.join(","));
    } else {
        for e in &entries {
            println!("{:>8}  {}", human(e.bytes), e.path.display());
        }
        println!("{:>8}  total ({} files)", human(total), entries.len());
    }
    Ok(())
}
