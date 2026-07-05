const fs = require('fs');
const html = fs.readFileSync('onlyflix.html', 'utf8');
const matches = html.match(/<article[^>]*>/ig) || [];
const classes = new Set();
matches.forEach(m => {
  const cMatch = m.match(/class="([^"]+)"/i);
  if (cMatch) classes.add(cMatch[1]);
});
console.log(Array.from(classes).join('\n'));
