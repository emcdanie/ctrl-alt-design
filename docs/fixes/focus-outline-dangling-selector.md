# Fix: a stray 2px outline / "weird line" around a whole shell

## Symptom
A permanent 2px outline (a "weird line") drawn around an entire container — e.g. the full 1240 case-study
shell — on every page of a type. Looks like a rogue border but no `border` rule explains it.

## Root cause
A **dangling selector with a trailing comma**. An earlier edit left `.cs-shell,` with a trailing comma
above the global `:focus-visible` rule, so the selector list merged: `.cs-shell, :focus-visible { outline:
2px … }`. The focus outline got permanently applied to the whole shell, not just focused elements.

## The fix
Repair the selector (remove the dangling `.cs-shell,`), confirm `outline: none` is the computed value on
the shell, restore any `scroll-padding` that rode along with it.

## Guard / lesson
A trailing comma in a selector list silently swallows the next rule's selector — one of the nastiest CSS
bugs because nothing errors. When a global style appears where it shouldn't, look **directly above it** for
a dangling selector or stray comma. Consider a stylelint rule to catch invalid/empty selectors on commit.
