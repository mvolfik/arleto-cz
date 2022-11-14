import("./build/index.js").then(async ({ server }) => {
  function createHandler(signal) {
    process.on(signal, () => {
      console.info(`Received ${signal}: closing server, please wait for all connections to close`);
      server.server.close();
    });
  }
  createHandler("SIGINT");
  createHandler("SIGTERM");
});
