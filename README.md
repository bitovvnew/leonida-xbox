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
![compat](https://img.shields.io/badge/story-100%25-39ff6a?style=flat-square&labelColor=000)
![xbox](https://img.shields.io/badge/xbox%20branch-58%25-ffd23b?style=flat-square&labelColor=000)
![drop](https://img.shields.io/badge/public%20drop-22.12.2026-ff3b3b?style=flat-square&labelColor=000)

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

## bench

`--scene=vice_beach_night_rain --len=600s` · 412 rigs reported · frame-gen on where available

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

```
boot / menus           ■■■■■■■■■■■■■■■■■■■■ 100%
story ch1-ch4          ■■■■■■■■■■■■■■■■■■■■ 100%
open world streaming   ■■■■■■■■■■■■■■■■■■■· 97%
radio + audio          ■■■■■■■■■■■■■■■■■■■· 94%
online p2p             ■■■■■■■■■■■■■■······ 71%
xbox branch            ■■■■■■■■■■■■········ 58%
```

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

## get it

**→ open the site (github pages link in the sidebar) and pull the build from there.**

---

<details>
<summary><sub>fine print</sub></summary>

<sub>parody / prank. not affiliated with rockstar games or take-two interactive. there is no build, no emulator and no download. the site collects nothing. if you got here looking for a pirated copy, go buy the game.</sub>

</details>
