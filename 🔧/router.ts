import { serve } from "https://deno.land/std/http/server.ts";

const aliases = {
  git: "🌀",
  env: "⚙️",
  "роби_гарашо": "🌀.зроби_гарашо",
  "docker_start": "🧪.запусти_докер",
};

function resolveAlias(maybe) {
  const alias = aliases[maybe];
  if (!alias) return [maybe, ""];
  const [agent, method] = alias.split(".");
  return [agent ?? maybe, method ?? "зроби_харашо"];
}

serve(async (req) => {
  const url = new URL(req.url);
  const route = url.pathname.slice(1); // remove leading /
  const [agent, method] = resolveAlias(route);
  return new Response(
    JSON.stringify({ agent, method }),
    { headers: { "Content-Type": "application/json" } },
  );
}, { port: 8787 });