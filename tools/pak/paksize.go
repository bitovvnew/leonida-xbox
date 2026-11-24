// paksize prints the size of every .rpf pak in a directory and the total,
// in the same format as the tree on the mirror page.
//
//	go run paksize.go ./data
package main

import (
	"fmt"
	"io/fs"
	"os"
	"path/filepath"
	"sort"
	"strings"
)

type pak struct {
	name string
	size int64
}

func human(b int64) string {
	const unit = 1024
	if b < unit {
		return fmt.Sprintf("%dB", b)
	}
	div, exp := int64(unit), 0
	for n := b / unit; n >= unit; n /= unit {
		div *= unit
		exp++
	}
	return fmt.Sprintf("%.1f%c", float64(b)/float64(div), "KMGT"[exp])
}

func main() {
	root := "."
	if len(os.Args) > 1 {
		root = os.Args[1]
	}
	var paks []pak
	var total int64
	err := filepath.WalkDir(root, func(p string, d fs.DirEntry, err error) error {
		if err != nil || d.IsDir() || !strings.HasSuffix(strings.ToLower(p), ".rpf") {
			return err
		}
		info, err := d.Info()
		if err != nil {
			return err
		}
		paks = append(paks, pak{filepath.ToSlash(p), info.Size()})
		total += info.Size()
		return nil
	})
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
	sort.Slice(paks, func(i, j int) bool { return paks[i].size > paks[j].size })
	for _, p := range paks {
		fmt.Printf("%-40s %8s\n", p.name, human(p.size))
	}
	fmt.Printf("%-40s %8s\n", fmt.Sprintf("total (%d paks)", len(paks)), human(total))
}
