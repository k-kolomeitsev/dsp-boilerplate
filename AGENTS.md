# DSP Agent Guidance

This project uses **Data Structure Protocol (DSP)** — graph-based structural memory stored in `.dsp/`.

## Running the CLI

`dsp-cli` below is shorthand for the bundled script:

```bash
python <skill-path>/scripts/dsp-cli.py --root . <command> [args]
```

The script lives in the installed skill directory (`.claude/skills/data-structure-protocol/`, `.cursor/skills/...`, or `.codex/skills/...`). All `source` paths are repo-relative. Arguments are **positional** (no `--source`/`--purpose`/`--why` flags); quote multi-word values.

## Rules

1. **Before changing code**: locate affected entities via `search`, `find-by-source`, or `read-toc`, then read `description`/`imports`
2. **When creating files/functions**: register with `create-object`, `create-function`, `create-shared`, `add-import` (always include `why`)
3. **When deleting/moving**: use `remove-entity`, `remove-import`, `remove-shared`, `move-entity`
4. **Internal-only changes**: don't update DSP (formatting, comments, private function bodies)

## This Project

Two roots (entry points), each with a directory scope:

| Root | TOC file | Entry point | Scope |
|------|----------|-------------|-------|
| Backend | `TOC-obj-82e23068` | `src/main.ts` | `src` |
| Frontend | `TOC-obj-ca619436` | `frontend/src/main.tsx` | `frontend` |

New entities land in every TOC whose root scope covers their source path — files under `src/` go to the backend TOC, files under `frontend/` to the frontend TOC. Override with repeatable `--toc <TOC>` (`<TOC>` = root UID or `default`). Externals (bare package names) match no scope: pass `--toc` explicitly on create, and use `add-to-toc` when a second root starts using them.

## Key Commands

| Command | What it does |
|---------|-------------|
| `search <query>` | Find entities by keyword |
| `find-by-source <path>` | Find entity by file path |
| `get-entity <uid>` | Inspect one entity |
| `get-children <uid> --depth N` | Downward dependency tree (what it imports) |
| `get-parents <uid> --depth N` | Upward dependency tree (impact analysis) |
| `get-recipients <uid>` | All importers of this entity, with reasons |
| `get-stats` | Graph overview |
| `read-toc --toc <root-uid>` | List all entities of a TOC (first line = root) |
| `create-object <source> <purpose>` | Register a module/class/config/external dep |
| `create-function <source>#<symbol> <purpose> --owner <uid>` | Register a function |
| `add-import <from> <to> <why>` | Add dependency with reason |
| `create-shared <owner> <shared-uid>` | Mark existing entity (by UID) as public API |
| `add-to-toc <uid> ... --toc <TOC>` | Add existing entities to TOC(s) — batch, idempotent |
| `move-to-toc <uid> ... --from <TOC> --to <TOC>` | Transfer entities between TOCs — batch, all-or-nothing |
| `move-entity <uid> <new-path>` | Update source path after file move |
| `remove-entity <uid>` | Delete an entity from the graph (cascading) |
| `update-description <uid> --source/--purpose/--kind/--scope` | Update entity fields |
| `detect-cycles` | Find circular dependencies |
| `get-orphans` | Find unused entities (nothing imports them) |

**Shared entities are UIDs, not names.** To expose something as public API: first `create-function` (or `create-object`) for it, then pass the returned UID to `create-shared`. The CLI rejects anything that is not an existing `obj-`/`func-` UID.

**Imports via an exporter.** When importing a specific shared symbol from a module, pass `--exporter <module-uid>` to both `add-import` and the matching `remove-import` — the reverse index lives under the exporter.

**Re-indexing keeps UIDs.** Source files carry `@dsp <uid>` markers; if `.dsp/` is ever rebuilt, pass `--uid <uid>` to `create-object`/`create-function` so entities keep their identity. The CLI fails on collisions and `obj-`/`func-` prefix mismatches.
