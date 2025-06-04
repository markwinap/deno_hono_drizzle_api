```
deno task start
```

- src/: Contains the source code of the application.
    - controllers/: Handles the business logic for each route.
    - middleware/: Contains functions that execute during the request-response cycle, such as authentication, logging, or validation.
    - models/: Defines the data models and their interactions with the database.
    - routes/: Defines how the application responds to client requests.
    - services/: Houses services that are not directly related to controllers or models.
    - utils/: Contains miscellaneous utility functions.
    - app.js: The main entry point of the application.
- public/: Holds static files like CSS, JavaScript, and images.
    - images/: Stores image files.
    - stylesheets/: Contains CSS files.
    - scripts/: Houses JavaScript files.
- views/: Contains template files for rendering views.
    - partials/: Stores reusable template fragments.
    - layouts/: Holds layout templates.
- test/: Contains test files.
    - unit/: Houses unit tests.
    - integration/: Stores integration tests.
    - e2e/: Contains end-to-end tests.
- config/: Holds configuration files for different environments.
    - development/: Contains development environment configurations.
    - production/: Contains production environment configurations.
    - index.js: Main configuration file.
- logs/: Stores log files.
    - .gitignore: Specifies files and directories to be ignored by Git.
    - .env: Stores environment variables.
    - .env.local: Stores local environment variables.
- package.json: Contains metadata about the project and its dependencies.
- README.md: Provides an overview of the project, installation instructions, and usage information.

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


Automatically instrument your application to send telemetry data to Grafana Cloud

OTEL_TRACES_EXPORTER="otlp" \
OTEL_EXPORTER_OTLP_ENDPOINT="https://otlp-gateway-prod-us-east-2.grafana.net/otlp" \
OTEL_EXPORTER_OTLP_HEADERS="Authorization=Basic MTI3ODQzNTpnbGNfZXlKdklqb2lNVFEwT0RjNU1TSXNJbTRpT2lKemRHRmpheTB4TWpjNE5ETTFMVzkwWld3dGIyNWliMkZ5WkdsdVp5MTBaWE4wSWl3aWF5STZJbGgzTVdJek5tMDRNREV3V2pKck1HcG5ObmxaY2twdVpDSXNJbTBpT25zaWNpSTZJbkJ5YjJRdGRYTXRaV0Z6ZEMwd0luMTk="\
OTEL_RESOURCE_ATTRIBUTES="service.name=my-app,service.namespace=my-application-group,deployment.environment=production" \
OTEL_NODE_RESOURCE_DETECTORS="env,host,os" \
NODE_OPTIONS="--require @opentelemetry/auto-instrumentations-node/register" \
node <my-app>.js



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

### Run Deno Server
```sh
deno run otel
```