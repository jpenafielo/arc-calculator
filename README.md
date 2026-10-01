# Arc Calculator

A small full-stack calculator built with React, TypeScript, and Go. The browser sends each calculation to a stateless REST API; the Go service owns arithmetic and input validation.

## Run with one command

With Docker Desktop (or Docker Engine) and Compose v2 running, run this from the repository root in PowerShell, bash, or zsh:

```sh
docker compose up --build
```

Open [http://localhost:8080](http://localhost:8080). Press Ctrl+C to stop. If your Docker installation provides the standalone Compose command instead, use `docker-compose up --build`.

The Docker build installs frontend dependencies, builds React and Go, and serves both the UI and API from one container. No local Go or Node.js installation is needed for this route.

## Run without Docker

This route requires Go 1.22 or newer and Node.js 20 or newer with npm. From the repository root, build the frontend and watch for changes in one terminal:

```sh
cd frontend
npm install
npm run dev
```

In another terminal, start the API and serve the built frontend. From the repository root, use the command for your shell:

**macOS/Linux (bash or zsh)**

```sh
cd backend
STATIC_DIR=../frontend/dist go run ./cmd/server
```

**Windows (PowerShell)**

```powershell
cd backend
$env:STATIC_DIR = "../frontend/dist"
go run ./cmd/server
```

Open [http://localhost:8080](http://localhost:8080). The frontend and API share one origin, so no CORS configuration is needed. For a one-time production build, run `npm run build` instead of `npm run dev`. Set `LISTEN_ADDR` to change the server address (default `:8080`). Run the API alone with `go run ./cmd/server`.

## API

`POST /api/calculate` accepts JSON with an `operation`, `a`, and (except for square root) `b`. Supported operations are `add`, `subtract`, `multiply`, `divide`, `power`, `sqrt`, and `percent`. Percentage means **a percent of b**: `percent(25, 80) = 20`.

```sh
curl -X POST http://localhost:8080/api/calculate \
  -H 'Content-Type: application/json' \
  -d '{"operation":"divide","a":9,"b":2}'
```

```json
{"result":4.5}
```

In PowerShell, use `Invoke-RestMethod` for the same request:

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:8080/api/calculate -ContentType "application/json" -Body '{"operation":"divide","a":9,"b":2}'
```

```sh
curl -X POST http://localhost:8080/api/calculate \
  -H 'Content-Type: application/json' \
  -d '{"operation":"sqrt","a":81}'
```

```json
{"result":9}
```

Invalid JSON or missing inputs return HTTP 400. Division by zero, negative square roots, and results outside the finite numeric range return HTTP 422. Errors use a stable code and a human-readable message:

```json
{"error":{"code":"division_by_zero","message":"cannot divide by zero"}}
```

`GET /api/health` returns `{"status":"ok"}`.

## Tests and coverage

```sh
cd backend
go test -coverprofile=coverage.out ./...
go tool cover -func=coverage.out
```

```sh
cd frontend
npm run test:coverage
```

See [COVERAGE.md](COVERAGE.md) for the recorded results.

## Design decisions

- The arithmetic is a small pure Go package, separate from HTTP parsing and response mapping. This keeps edge cases easy to test without starting a server.
- The API accepts a strict JSON object, rejects unknown fields and extra JSON, and caps request bodies at 4 KiB. Both layers reject invalid or non-finite numbers.
- The browser only formats results; it never computes them locally. React escapes server error text when rendering it.
- Go's `float64` is appropriate for this general-purpose calculator. It is **not** decimal-exact: values such as `0.1 + 0.2` can have binary floating-point rounding. Money calculations would need a decimal representation.
- esbuild keeps the frontend setup small. Go serves its static output, allowing local use with a single origin and no proxy or CORS policy.
- The multistage Docker build produces one container with the Go server and compiled React files. Compose exposes it on port 8080, so starting the full application takes one command.
