import "dotenv/config";
import { createApp } from "./app";
import { bootstrapSeedData } from "./shared/bootstrap";

async function start() {
  await bootstrapSeedData();

  const app = createApp();
  const port = Number(process.env.PORT ?? 4000);

  app.listen(port, '0.0.0.0', () => {
    // eslint-disable-next-line no-console
    console.log(`Backend listening on http://localhost:${port}`);
  });
}

start().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("Failed to start backend", error);
  process.exit(1);
});
