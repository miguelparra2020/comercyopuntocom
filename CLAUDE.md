# Comercyo.com — Claude Code Configuration

## Superpowers Plugin

This project uses the `superpowers@claude-plugins-official` plugin.

Before ANY task — including answering questions, making changes, or writing code — invoke the `superpowers:using-superpowers` skill to determine which skills apply.

## Project Stack

- **Framework:** React 18 + TypeScript
- **Build tool:** Vite
- **Linting:** ESLint with typescript-eslint

## Workflow Rules

### Planning
- For any new feature or non-trivial change, invoke `superpowers:brainstorming` before writing code.
- For multi-step tasks, invoke `superpowers:writing-plans` to create a plan, then `superpowers:executing-plans` to carry it out.

### Development
- Follow `superpowers:test-driven-development` when implementing features or fixing bugs.
- Use `superpowers:systematic-debugging` when encountering bugs or unexpected behavior.

### Completion
- Before claiming work is done, invoke `superpowers:verification-before-completion`.
- Before merging or creating PRs, invoke `superpowers:requesting-code-review`.

## Commands

- `npm run dev` — start dev server
- `npm run build` — TypeScript check + Vite build
- `npm run lint` — ESLint
- `npm run preview` — preview production build
