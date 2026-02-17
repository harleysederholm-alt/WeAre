# Contributing to WeAre

Thank you for your interest in contributing to WeAre! We require high standards of code quality and architectural integrity to maintain our enterprise-grade status.

## Architectural Principles

1.  **Event Sourcing is King:** Do not mutate state directly. Always emit an event.
2.  **Strict Typing:** `any` is forbidden. Define DTOs and Interfaces.
3.  **Visual Consistency:** Use the `White Glass` theme tokens in `globals.css`. Do not introduce ad-hoc styles.

## Pull Request Process

1.  Ensure local build passes: `npm run build`.
2.  Update `task.md` and `walkthrough.md` if significant changes are made.
3.  Commit messages should follow [Conventional Commits](https://www.conventionalcommits.org/).

## Coding Standards

*   Use `prettier` for formatting.
*   React Components should be functional and use hooks.
*   Backend Services should use Dependency Injection.
