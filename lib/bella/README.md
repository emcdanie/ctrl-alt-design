# BELLA (vendored)

Source of truth: https://github.com/emcdanie/bella

Pinned version and commit live in `sync-manifest.json`, which is written by
`npm run sync:bella` and hash-checked by `npm run audit:sync` in the gate.
Do not record a version by hand here; it drifted from v0.1.1 to 0.3.0 unnoticed
once already.

## What is vendored

| Vendored path                             | Upstream                                |
| ----------------------------------------- | --------------------------------------- |
| `lib/bella/bella.css`                     | `tokens/bella.css`                      |
| `components/bella/Card/`                  | `src/components/Card/`                  |
| `components/bella/shared/Trace.module.css`| `src/components/shared/Trace.module.css`|

Every one of those files is DO NOT EDIT. The gate hashes them, so an in-place
fix fails CI. Change it upstream in BELLA, then `npm run sync:bella` and review
the diff like any other change.

`components/ui/Card.tsx` is a thin adapter, not a copy: it binds `next/link`
into BELLA's injected `linkComponent` and passes everything else through.

## Consumer-side token overrides

`app/globals.css` re-points two BELLA token names at this repo's tuned values,
deliberately, with the reasoning recorded inline: `--color-semantic-surface`
and `--color-semantic-surface-inset`. Reference tokens by custom property, never
by resolved value, so an override lands everywhere at once.
