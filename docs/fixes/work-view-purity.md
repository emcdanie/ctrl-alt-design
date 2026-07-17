# Work view purity: the card strip under Map and Table

Symptom (Elleta, 17 Jul): Map and Table still showed a strip of cards at
the bottom, after the lock pass had "removed card grids from other views".

Where it was hiding: the strip was never the library's CardsView. It was
CtrlAltDesignSection (the Design Lab video/prototype galleries), rendered
by app/work/page.tsx BELOW the library on every view. The lock pass
correctly scoped the library's own card grid to the Cards view but never
touched the page-level section that follows the library.

Fix: CtrlAltDesignSection renders inside WorkLibrary's Cards branch only.
Map = bubbles only, Table = rows only, Cards = cards (library + Lab).

Rule to keep: view purity is a property of the whole PAGE, not just the
switcher component. When a view must own the page, everything below the
switcher belongs to a view branch too.
