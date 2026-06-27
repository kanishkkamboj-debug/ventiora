const fs = require('fs');

const lines = fs.readFileSync('C:\\Users\\HP\\.gemini\\antigravity\\brain\\4fdb1bc0-c022-4ca3-bde1-c9a2247a3adb\\.system_generated\\logs\\transcript_full.jsonl', 'utf8').split('\n');

for (const line of lines) {
  if (!line.trim()) continue;
  try {
    const data = JSON.parse(line);
    if (data.type === 'USER_INPUT' && data.content && data.content.includes('theme 1 dark mode')) {
      console.log('--- FOUND USER CSS ---');
      console.log(data.content);
    }
  } catch (e) {
    // ignore
  }
}
