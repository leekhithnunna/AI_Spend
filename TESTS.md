# Tests

This repository includes a lightweight test suite for the audit engine.

## What is covered
- Core audit rules for plan downgrades and cost optimization
- High API spend detection
- Enterprise plan guidance for small teams
- Unused seat detection
- Optimized state when no savings apply

## Run tests

```bash
cd frontend
npm test
```

## Notes
- Tests use `Vitest` and run in Node environment
- `frontend/vitest.config.ts` resolves the project `@` path alias
- The test suite is intentionally focused on deterministic business logic
