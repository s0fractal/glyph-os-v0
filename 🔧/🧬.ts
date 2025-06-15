#!/usr/bin/env -S deno run -A
import { exists } from "https://deno.land/std@0.224.0/fs/mod.ts";
import { parse } from "https://deno.land/std@0.224.0/flags/mod.ts";
// Виправлення шляху
const cwd = decodeURIComponent(new URL(".", import.meta.url).pathname);
const projectRoot = cwd;
const supabaseConfig = `${projectRoot}/supabase/config.toml`;
// Визначення назви репозиторію
const REPO_NAME = cwd.split("/").filter(Boolean).pop() ?? "glyph-os-v0";
try {
  Deno.chdir(cwd);
} catch (e) {
  console.error(`❌ Failed to chdir to ${cwd}: ${e.message}`);
  Deno.exit(1);
}
const args = parse(Deno.args);
const cmd = String(args._[0] ?? "");
const makeScript = (cmd: string) =>
  `#!/bin/bash
deno run -A "$HOME/.${REPO_NAME}/🔧/🧬.ts" ${cmd} "$@"
`;

switch (cmd) {
  case "init": {
    const home = Deno.env.get("HOME");
    if (!home) {
      console.error("❌ Could not determine HOME directory.");
      Deno.exit(1);
    }

    const binPaths = [`${home}/.deno/bin`, `${home}/.local/bin`];
    const names = ["fractal", "f", "glyphos", "g"];

    for (const binPath of binPaths) {
      await Deno.mkdir(binPath, { recursive: true });

      for (const name of names) {
        const path = `${binPath}/${name}`;
        if (!(await exists(path))) {
          await Deno.writeTextFile(
            path,
            makeScript(name === "g" ? "glyphs" : ""),
          );
          await Deno.chmod(path, 0o755);
          console.log(`✅ CLI alias '${name}' created at ${path}`);
        }
      }
    }

    console.log("🔗 Aliases installed to ~/.local/bin and ~/.deno/bin");
    console.log(
      "📘 You may need to restart your shell or run `source ~/.zshrc`",
    );
    Deno.exit(0);
  }

  case "setup": {
    console.log("🔧 Running full setup...");

    const brewDeps = ["deno", "supabase", "postgresql", "windmill"];
    for (const dep of brewDeps) {
      try {
        const status = await Deno.run({
          cmd: ["brew", "list", dep],
          stdout: "null",
          stderr: "null",
        }).status();
        console.log(
          `🔍 ${dep}: ${status.success ? "already installed" : "❌ not found"}`,
        );
      } catch {
        console.log(`❌ brew not available or error during check`);
      }
    }

    if (await exists("seed/seed.sql")) {
      console.log("🌱 Found seed.sql — executing...");
      const proc = await Deno.run({
        cmd: ["psql", "-d", "fractal", "-f", "seed/seed.sql"],
      }).status();
      console.log(proc.success ? "✅ Seed executed" : "❌ Seed failed");
    }

    if (!(await exists(supabaseConfig))) {
      console.log("🌀 Running `supabase init` in parent directory...");
      const proc = Deno.run({ cmd: ["supabase", "init"], cwd: projectRoot });
      await proc.status();
    }

    console.log("🎉 Setup complete.");
    break;
  }

  case "glyphs":
    console.log("📁 Exporting glyphs...");
    const glyphs = {
      "@seed": "seed/seed.sql",
      "@intent": "fractal/intents.yaml",
      "@anchor": ".well-known/anchor.json",
    };
    await Deno.writeTextFile(
      ".well-known/fractal.json",
      JSON.stringify(glyphs, null, 2),
    );
    console.log("✅ .well-known/fractal.json created");
    break;

  case "pulse":
    console.log("💓 Fractal Pulse: System active.");
    break;

  case "install":
    if (args._[1]) {
      const name = args._[1];
      console.log(`📦 Installing angel: ${name}`);
      await Deno.mkdir(`./cellar/${name}`, { recursive: true });
      await Deno.writeTextFile(
        `./cellar/${name}/README.md`,
        `# Angel: ${name}\nInstalled via fractal`,
      );
    } else {
      console.log("❌ Please specify the name of the angel to install.");
    }
    break;

  case "angels":
    console.log("🧬 Available angels:");
    for await (const dir of Deno.readDir("./cellar")) {
      if (dir.isDirectory) console.log(` - ${dir.name}`);
    }
    break;

  case "doctor":
    console.log("🩺 Running Fractal Doctor...");

    const checks = [
      { name: "Deno", cmd: "deno --version" },
      { name: "Fractal CLI", cmd: "which fractal" },
      { name: "Alias f", cmd: "which f" },
      { name: "Alias g", cmd: "which g" },
      { name: "Repo", cmd: "test -d ~/.s0fractal" },
    ];

    for (const check of checks) {
      try {
        const proc = check.cmd.startsWith("test")
          ? await Deno.run({ cmd: ["bash", "-c", check.cmd] }).status()
          : await Deno.run({
            cmd: check.cmd.split(" "),
            stdout: "inherit",
            stderr: "inherit",
          }).status();
        console.log(`✅ ${check.name}: ${proc.success ? "ok" : "missing"}`);
      } catch {
        console.log(`❌ ${check.name}: error`);
      }
    }

    break;

  default:
    console.log("🌀 Fractal CLI");
    console.log("Usage:");
    console.log("  fractal.ts init         # set up CLI aliases");
    console.log("  fractal.ts setup        # install via brew, init supabase");
    console.log("  fractal.ts glyphs       # export .well-known/fractal.json");
    console.log("  fractal.ts install <a>  # install angel");
    console.log("  fractal.ts pulse        # heartbeat");
    console.log("  fractal.ts angels       # list installed angels");
    console.log("  fractal.ts doctor       # check config");
    break;
}
