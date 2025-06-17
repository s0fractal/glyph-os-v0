const { run } = Deno;

async function startTunnel() {
    console.log("🚇 Запускаємо Cloudflare Tunnel...");
    const tunnel = run({
        cmd: ["cloudflared", "tunnel", "run", "glf-mac-agent"],
        stdout: "piped",
        stderr: "piped",
    });
    console.log("✅ Tunnel запущено (якщо все ок)");
}

async function startServer() {
    console.log("🌀 Запускаємо GLF endpoint...");
    const p = run({
        cmd: ["deno", "run", "-A", "glf-agent.ts"],
        stdout: "piped",
        stderr: "piped",
    });
    console.log("✅ GLF Agent активний");
}

startTunnel();
startServer();
