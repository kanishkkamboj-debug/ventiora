const fs = require('fs');
const path = require('path');
function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) walk(fullPath);
    else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      
      const newContent1 = content.replace(/\.\.\/common\//g, '../ui/');
      if (newContent1 !== content) { content = newContent1; modified = true; }
      
      const newContent2 = content.replace(/\.\.\/\.\.\/common\//g, '../../ui/');
      if (newContent2 !== content) { content = newContent2; modified = true; }

      const newContent3 = content.replace(/from\s+['"]\.\.\/ui\/Button['"]/g, "from '../ui/Button'");
      if (newContent3 !== content) { content = newContent3; modified = true; }

      // Fix `import { cn } from '../ui/Button'` to `import { cn } from '../../utils/cn'`
      const newContent4 = content.replace(/import\s*\{\s*cn\s*\}\s*from\s*['"]\.\.\/ui\/Button['"]/g, "import { cn } from '../../utils/cn'");
      if (newContent4 !== content) { content = newContent4; modified = true; }

      // Avatar prop user={X} -> avatarUrl={X?.avatar_url} username={X?.username}
      const newContent5 = content.replace(/<Avatar\s+([^>]*?)user=\{([^}]+)\}([^>]*?)>/g, "<Avatar $1avatarUrl={$2?.avatar_url} username={$2?.username}$3>");
      if (newContent5 !== content) { content = newContent5; modified = true; }

      if (modified) fs.writeFileSync(fullPath, content);
    }
  }
}
walk('./src');
console.log('Done fixing common to ui and Avatar props!');
