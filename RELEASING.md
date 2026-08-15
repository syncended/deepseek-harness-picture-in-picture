# Releasing

Releases follow the same tag-driven npm publication flow as `@syncended/dsh-codex`.

## One-time setup

1. **Register on npm** — https://www.npmjs.com/signup
2. **Create a Granular Access Token that bypasses 2FA** — https://www.npmjs.com/settings/<user>/tokens → Generate New Token → **Granular Access Token**:
   - Permissions: **Packages and scopes** → **Read and write**, for scope `@syncended` or package `@syncended/dsh-pip`.
   - **Two-factor authentication: Bypass two-factor authentication** — required for token-based CI publication when the account has 2FA enabled.
   - A classic **Automation** token also works, but granular + bypass is preferred.
3. **Add the token to GitHub Actions secrets** — repository → Settings → Secrets and variables → Actions → New repository secret:
   - Name: `NPM_REGISTRY_TOKEN`
   - Value: the npm token from step 2.

## Every release

Start from a clean branch with all checks passing:

```bash
npm test
npm run build
npm pack --dry-run
```

Then bump, commit, tag, and push:

```bash
npm version patch   # or minor, major, or an explicit version such as 0.1.1
git push --follow-tags
```

`npm version` creates a `v<version>` Git tag. The `.github/workflows/release.yml` workflow verifies that the tag matches `package.json`, runs build/tests/package checks, then publishes with npm provenance.

Package page:

https://www.npmjs.com/package/@syncended/dsh-pip

After publication, users install with:

```bash
dsh plugin --profile web add @syncended/dsh-pip
```

Some pnpm-backed profiles require `-w`:

```bash
dsh plugin --profile web add -w @syncended/dsh-pip
```

Restart `dsh --profile web` after installation.
