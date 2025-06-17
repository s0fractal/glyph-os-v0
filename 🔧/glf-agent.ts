import { serve } from "https://deno.land/std/http/server.ts";

serve(async (req) => {
    if (req.method === "POST") {
        const { intent } = await req.json();
        if (intent === "ping") {
            return new Response(
                JSON.stringify({ status: "🎯 GLF мак агент на звʼязку" }),
                {
                    headers: { "Content-Type": "application/json" },
                },
            );
        }
        return new Response(JSON.stringify({ error: "❌ Unknown intent" }), {
            status: 400,
        });
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
