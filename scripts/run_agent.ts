import { google } from 'googleapis';
import * as fs from 'fs';

// Зчитуємо авторизаційні дані з JSON
const credentials = JSON.parse(fs.readFileSync('credentials.json', 'utf8'));

async function main() {
  const auth = new google.auth.OAuth2(
    credentials.client_id,
    credentials.client_secret
  );

  auth.setCredentials({ refresh_token: credentials.refresh_token });

  const projectId = await google.auth.getProjectId();
  console.log('✅ Authenticated as project:', projectId);

  // Тестовий виклик (Cloud Run services list)
  const run = google.run('v1');
  const res = await run.projects.locations.services.list({
    auth,
    parent: `projects/${projectId}/locations/-`,
  });

  console.log('🧠 Cloud Run services:');
  console.log(res.data);
}

main().catch(console.error);
