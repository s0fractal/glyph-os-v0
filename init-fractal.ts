// init-fractal.ts
const projectName = "💠🧬🔁";
const slug = "fractal-loop-core"; // fallback slug для CLI
const password = "💠🌊🫧🧪🧬-v1";

// 1. Створення проекту
const create = await new Deno.Command("supabase", {
    args: ["projects", "create", slug, "--db-password", password],
    stdout: "piped",
    stderr: "piped",
}).output();

if (!create.success) {
    console.error(new TextDecoder().decode(create.stderr));
    Deno.exit(1);
}

console.log("✅ Проєкт створено");

// 2. Ініціалізація supabase-папки
await new Deno.Command("supabase", { args: ["init"], stdout: "inherit" })
    .output();

// 3. Лінк проєкту (обираєш або додаєш вручну)
await new Deno.Command("supabase", { args: ["link"], stdout: "inherit" })
    .output();

// 4. Запис фрактального паролю
await Deno.writeTextFile(".env", `SUPABASE_DB_PASSWORD="${password}"\n`);

console.log("✅ Пароль збережено в .env");

// 5. Готово для подальших кроків: міграцій, функцій, бакетів
console.log("🧬 Фрактальний проєкт готовий до мутації.");
