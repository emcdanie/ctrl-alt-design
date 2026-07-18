# specs/ — spec-driven work

Every non-trivial task gets a folder here: `specs/<slug>/` containing
`design.md` (what and why, which existing components/tokens), `requirements.md`
(testable acceptance criteria incl. the standing gates), and `tasks.md`
(checkoffable ordered tasks ending with the gate + verification steps).

The agent generates all three via the `portfolio-spec` skill, then STOPS for
Elleta's review. Execution starts only on her explicit go. Finished specs stay
here as the record of why a thing was built.
