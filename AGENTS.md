# DSP Agent Guidance

This project uses **Data Structure Protocol (DSP)** — graph-based structural memory stored in `.dsp/`.

## Rules

1. **Before changing code**: locate affected entities via `search`, `find-by-source`, or `read-toc`, then read `description`/`imports`
2. **When creating files/functions**: register with `create-object`, `create-function`, `create-shared`, `add-import` (always include `why`)
3. **When deleting/moving**: use `remove-entity`, `remove-import`, `remove-shared`, `move-entity`
4. **Internal-only changes**: don't update DSP (formatting, comments, private function bodies)

## This Project

Two roots (entry points):

| Root | TOC file | Entry point |
|------|----------|-------------|
| Backend | `TOC-obj-82e23068` | `src/main.ts` |
| Frontend | `TOC-obj-ca619436` | `frontend/src/main.tsx` |

## Key Commands

| Command | What it does |
|---------|-------------|
| `search <query>` | Find entities by keyword |
| `find-by-source <path>` | Find entity by file path |
| `get-entity <uid>` | Inspect one entity |
| `get-children <uid> --depth N` | Downward dependency tree |
| `get-parents <uid> --depth N` | Upward dependency tree (impact analysis) |
| `get-recipients <uid>` | Who imports this entity |
| `get-stats` | Graph overview |
| `read-toc --toc <root-uid>` | Table of contents from root |
| `create-object <source> <purpose>` | Register a module/file |
| `create-function <source> <purpose>` | Register a function |
| `add-import <from> <to> <why>` | Add dependency with reason |
| `create-shared <owner> <shared>` | Register public API |
| `detect-cycles` | Find circular dependencies |
| `get-orphans` | Find disconnected entities |
