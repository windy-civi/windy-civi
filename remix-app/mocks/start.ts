import { setupServer } from "msw/node";

const server = setupServer();

// todo: make this warn after beginning to mock apis
server.listen({ onUnhandledRequest: "bypass" });
console.info("🔶 Mock server running");

process.once("SIGINT", () => server.close());
process.once("SIGTERM", () => server.close());
