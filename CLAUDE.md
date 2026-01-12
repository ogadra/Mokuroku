# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Mokuroku (目録) is a website for displaying ogadra's speaking schedule and upcoming events. Built with Hono on Cloudflare Workers.

## Development Environment

This project uses Nix flakes with direnv. Requires `programs.nix-ld.enable = true` in NixOS config.

```bash
# Initial setup
make init

# Install dependencies
pnpm install

# Start local development server
pnpm dev

# Type check
pnpm typecheck

# Deploy to Cloudflare Workers
pnpm deploy
```

## Architecture

- **Runtime**: Cloudflare Workers
- **Framework**: Hono
- **Entry point**: `src/index.ts`
- **Config**: `wrangler.jsonc`

## Testing Guidelines

- Keep tests for the same endpoint in a single `it` block (avoid duplicate requests)
- Add Japanese description as the second argument of `expect` (must be a complete sentence)
  - Example: `expect(response.status, "ステータスコードが200であること").toBe(200)`
- Verify response content with exact match using `toBe`, not `toContain` (preserve order and full content)
