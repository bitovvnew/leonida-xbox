# changelog

```
$ git log --reverse --format="%ad  %s" --date=short leonida/toolchain
```

## why

a new console every few years. a game you can only play on that console. a price tag that eats a week of wages for a lot of people.
we started this for the ones who work all day and have a pc at home that is already good enough.
nobody here gets paid. nothing is for sale. the toolchain is the point: one day it should not matter which box you own.

---

## 0.9.0 — 2026-11-24
- mirror #3 up, devlog started (day 01)
- signed sha256 manifest for the dump, 9/9 mirrors
- `tools/verify.sh` for checking a pull before first launch

## 0.8.0 — 2026-11-19
- the dump arrived. 41.7G across 388 chunks
- `tools/manifest` (rust) and `tools/pak/paksize.go` to map what's inside
- pak index reader handles the new streaming layout

## 0.7.0 — 2026-11-02
- frame interpolation (neural upscale) prototype: +55–70% on 30/40-series
- fixed sim step + interpolation, physics no longer tied to framerate

## 0.6.0 — 2026-10-11
- tide audio: streaming radio, ambient beds, spatial mix
- streaming pak reader, async io on nvme

## 0.5.0 — 2026-09-14
- prism: async shader compile with a persistent pipeline cache
- first-boot cache build, zero recompiles after that

## 0.4.0 — 2026-06-27
- hyperion recompiles full test binaries ahead of time
- public console demos boot and run at full speed

## 0.3.0 — 2026-05-30
- shader translation for the console gpu's intermediate format
- save bridge: read/write of console save containers

## 0.2.0 — 2026-04-18
- prism: console gpu command stream → vulkan 1.3. first triangle on screen
- dx12 fallback path

## 0.1.0 — 2026-03-02
- hyperion: first function recompiled from a console test binary and run on x86-64
- 3 people, one discord, no idea if any of this would work
