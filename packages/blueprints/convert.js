const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

// Regex captures:
//  1) "import ... from '"
//  2) the import path
//  3) the trailing quote
const importRegex = /\b(import|export)(\s+(?:[^'"]*\s+from\s+|)[`'"])([^'"]+)([`'"])/g;

args.forEach((filePath) => {
  console.log(`converting ${filePath}`);
  // return;
  let code = fs.readFileSync(filePath, 'utf8');
  const dirOfFile = path.dirname(filePath);

  code = code.replace(importRegex, (match, imp, before, importPath, after) => {
    console.log(imp, before, importPath, after);
    // Only process relative paths (./ or ../)
    if (!importPath.startsWith('.')) return match;

    console.log('-progress');
    // If there's already an extension, do nothing
    if (path.extname(importPath)) return match;

    // Resolve absolute path
    const resolved = path.resolve(dirOfFile, importPath);
    let resolvedImportPath = importPath;
    try {
      const stats = fs.statSync(resolved);
      if (stats.isDirectory()) {
        resolvedImportPath = importPath.replace(/\/?$/, '/index.js');
      } else if (stats.isFile()) {
        resolvedImportPath += '.js';
      }
    } catch (e) {
      resolvedImportPath += '.js';

      // console.error(e);
      // If path doesn't exist, do nothing or handle as needed
      // (Leaving as-is in this basic example)
    }
    return imp + before + resolvedImportPath + after;
  });

  fs.writeFileSync(filePath, code, 'utf8');
  // console.log(code);
});
