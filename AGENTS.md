# Agent instructions — `docs` branch (GitHub Pages site)

Only `docs/` is published. Files at the repo root, like this one, are not served.

## Deploying

The site is served from two places, and they update independently:

1. **GitHub Pages** (`huge.github.io/nano-analyzer`): rebuilds by itself after a push to `docs` on the `Huge/nano-analyzer` remote (`initial-public` locally).
2. **bs.ehlas.cz**: an nginx server, `ssh provizorni` (alias in the maintainer's `~/.ssh/config`). It is a plain git checkout of the `docs` branch in `/var/www/bs-ehlas` with nginx root `/var/www/bs-ehlas/docs`. It does **not** sync on its own. After every push to `docs`, pull it by hand:

```bash
ssh provizorni 'cd /var/www/bs-ehlas && git pull --ff-only && git log --oneline -1'
```

The server has no `xmllint`, so run the SVG checks below locally before pushing. Then verify the live copy, for example:

```bash
curl -sL https://bs.ehlas.cz/stories/himalaya-terminal-injection-sanitization/himalaya-terminal-illustration.svg | xmllint --noout -
```

## SVG illustrations

Standalone `.svg` files (e.g. `docs/stories/*/*-illustration.svg`) are parsed as **XML**, not HTML. A single parse error makes the browser show only the `<img>` alt text.

- Do not use HTML named entities (`&nbsp;`, `&mdash;`, `&rarr;`, `&middot;`, …). Use the literal UTF-8 character or a numeric reference (`&#160;`, `&#8212;`, `&#8594;`). Only `&amp; &lt; &gt; &quot; &apos;` are allowed by name.
- Escape bare `&` and `<` in text as `&amp;` and `&lt;`.
- Czech pages under `docs/cz/stories/` load the same SVGs via `../../../stories/…`, so a broken SVG breaks both languages.

Before committing any SVG change, run both checks; they must print nothing:

```bash
find docs -name '*.svg' -exec xmllint --noout {} +
```

```bash
grep -rnoE '&[A-Za-z][A-Za-z0-9]*;' --include='*.svg' docs | grep -vE ':&(amp|lt|gt|quot|apos);$'
```

Then confirm it renders: open the `.svg` file itself in a browser and look at it. Opening the story `index.html` via `file://` in the built-in browser pane is not enough, because the pane loads it as a `data:` snapshot where relative image paths don't resolve (`naturalWidth` is 0 even for a valid SVG).
