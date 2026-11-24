<div align="center">

```
██╗     ███████╗ ██████╗ ███╗   ██╗██╗██████╗  █████╗
██║     ██╔════╝██╔═══██╗████╗  ██║██║██╔══██╗██╔══██╗
██║     █████╗  ██║   ██║██╔██╗ ██║██║██║  ██║███████║
██║     ██╔══╝  ██║   ██║██║╚██╗██║██║██║  ██║██╔══██║
███████╗███████╗╚██████╔╝██║ ╚████║██║██████╔╝██║  ██║
╚══════╝╚══════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝╚═════╝ ╚═╝  ╚═╝
```

**pc dev build · x64 · it boots**

![build](https://img.shields.io/badge/build-a3f91c2-39ff6a?style=flat-square&labelColor=000)
![status](https://img.shields.io/badge/mirror%20%233-online-39ff6a?style=flat-square&labelColor=000)
![devlog](https://img.shields.io/badge/devlog-daily-39ff6a?style=flat-square&labelColor=000)
![xbox](https://img.shields.io/badge/xbox%20branch-encrypted-ffd23b?style=flat-square&labelColor=000)
![drop](https://img.shields.io/badge/public%20drop-22.12.2026-ff3b3b?style=flat-square&labelColor=000)

<br>

[![open mirror](https://img.shields.io/badge/%E2%96%B6%20%20OPEN%20MIRROR-000000?style=for-the-badge&labelColor=000&color=39ff6a)](https://bitovvnew.github.io/leonida-xbox/)
&nbsp;
[![devlog](https://img.shields.io/badge/%E2%97%89%20%20LIVE%20DEVLOG-000000?style=for-the-badge&labelColor=000&color=1d7a35)](https://bitovvnew.github.io/leonida-xbox/#devlog)

</div>

---

```
$ cat README_FIRST.txt

  internal branch   leonida/pc-main@a3f91c2
  compiled          2026-08-02
  size              41.7 GB
  sha256            signed manifest, 9/9 mirrors in sync
  public drop       22.12.2026 18:00 UTC  (patched launcher + xbox branch)
```

> [!WARNING]
> mirror #2 is down after a takedown request. mirror #3 is still up. **the link is on the site, not here.**

## build weight

| part | packed | unpacked | chunks |
|---|---:|---:|---:|
| `data/vice_beach_streaming.rpf` | 14.2 G | 31.8 G | 128 |
| `data/leonida_world_00.rpf` | 9.8 G | 22.4 G | 89 |
| `data/audio_radio_all.rpf` | 6.1 G | 9.3 G | 56 |
| `data/peds_vehicles_hi.rpf` | 4.4 G | 11.7 G | 40 |
| `data/cutscenes_ch1-ch4.rpf` | 2.9 G | 4.0 G | 27 |
| `bin/` | 291 M | 291 M | 3 |
| `xbox_branch/` | 3.9 G | ? | 45 |
| **total** | **41.7 G** | **~80 G** | **388** |

first boot builds a ~2.3 G shader cache. plan for ~125 G free on an ssd.

## repo layout

```
.
├── index.html                 mirror page
├── posts.json                 devlog, appended daily by ci
├── vault.json                 sealed devlog entries
├── scripts/unlock.mjs         ci: unseals the day's entry
├── web/src/devlog.ts          devlog types + loader
├── web/src/StatusBars.tsx     status bars component
├── web/styles/terminal.css    shared terminal theme
├── tools/manifest/            rust: size manifest of a pulled build
├── tools/pak/paksize.go       go: per-pak sizes
├── tools/bench/frametimes.py  python: avg / 1% low from captures
└── tools/verify.sh            sha256 check before first launch
```

## target fps @ public drop

`--scene=vice_beach_night_rain --len=600s` · targets for the drop build · frame-gen on where available

| cpu | gpu | res | avg | 1% low |
|---|---|---|---:|---:|
| r5 3600 | gtx 1660s | 1080p low | 48 | 39 |
| i5-12400f | rtx 3060 12g | 1080p high | 72 | 58 |
| r5 7600 | rx 7700 xt | 1440p high | 81 | 66 |
| i5-13600k | rtx 4070 | 1440p ultra | **96** | 79 |
| r7 7700x | rx 7800 xt | 1440p ultra | 92 | 74 |
| r7 7800x3d | rtx 4080s | 2160p ultra | 88 | 71 |
| r9 9950x3d | rtx 5090 | 2160p pt | **144** | 118 |
| steam deck | rdna2 8cu | 800p low | 34 | 27 |

## status

live progress bars are on the site and move with every devlog entry.

## tree

```
leonida_pc_dev/
├── bin/
│   ├── leonida_x64.exe            212M
│   ├── hyperion_recomp.dll         48M
│   └── prism_vk_bridge.dll         31M
├── data/
│   ├── vice_beach_streaming.rpf  14.2G
│   ├── leonida_world_00.rpf       9.8G
│   ├── audio_radio_all.rpf        6.1G
│   ├── peds_vehicles_hi.rpf       4.4G
│   └── cutscenes_ch1-ch4.rpf      2.9G
├── xbox_branch/
│   └── quick_resume_proto.bin    [locked]
├── README_FIRST.txt
└── SHA256SUMS
```

## devlog

new entry every day until the drop. **→ the site (github pages link in the sidebar).**

`xbox_branch/quick_resume_proto.bin` is still encrypted. progress is in the devlog.

---

<details>
<summary><sub>fine print</sub></summary>

<sub>not affiliated with rockstar games or take-two interactive. parody. nothing is downloaded or collected.</sub>

</details>
