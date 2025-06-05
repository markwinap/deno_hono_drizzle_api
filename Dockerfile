FROM denoland/deno:latest

# Create working directory
WORKDIR /app
USER deno
COPY . .
# Compile the main app
RUN deno cache main.ts

EXPOSE 8000
# Run the app
CMD ["run", "--allow-net", "--allow-read", "main.ts"]