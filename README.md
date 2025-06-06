```
deno run start
```
## Drizzel DB ORM

### Create schema from an excisting DB tables
```sh
deno --env -A --node-modules-dir npm:drizzle-kit pull
```

### Push schema to the DB directly
```sh
deno --env -A --node-modules-dir npm:drizzle-kit push
```

### Generate migration
```sh
deno --env -A --node-modules-dir npm:drizzle-kit generate
deno --env -A --node-modules-dir npm:drizzle-kit migrate
```

## Open Telemetry
Documentation https://docs.deno.com/examples/grafana_tutorial/
### Build Image
```sh
docker build -t otel-collector .
```
### Run OTEL Docker Image
```sh
docker run --env-file .env -p 4317:4317 -p 4318:4318 otel-collector
```

### Run Deno with telemetry
```sh
deno run otel
```
