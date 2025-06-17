import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { $ } from "https://deno.land/x/dax@0.39.1/mod.ts";

const TUNNEL_NAME = "glf-mac-agent";

console.log("🚇 Запускаємо Cloudflare Tunnel...");

const tunnel = $`cloudflared tunnel run ${TUNNEL_NAME}`.quiet().spawn();

await new Promise((r) => setTimeout(r, 3000));
console.log("✅ Tunnel запущено (якщо все ок)");

console.log("🌀 Запускаємо GLF endpoint...");

serve(async (req) => {
    if (req.method === "POST") {
        try {
            const { intent } = await req.json();
            if (intent === "ping") {
                return Response.json({ status: "🎯 GLF мак агент на звʼязку" });
            }
            return Response.json({ error: "❌ Unknown intent" }, {
                status: 400,
            });
        } catch (_) {
            return Response.json({ error: "❌ Invalid JSON" }, { status: 400 });
        }
    }

    if (req.method === "GET") {
        const url = new URL(req.url);
        const intent = url.searchParams.get("intent");
        if (intent === "ping") {
            return new Response("pong", { status: 200 });
        }
    }

    return new Response("⛔ Unsupported", { status: 405 });
}, { port: 8787 });

console.log("✅ GLF Agent активний");
