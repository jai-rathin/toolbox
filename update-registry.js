const fs = require('fs');

const path = 'components/tools/registry.ts';
let content = fs.readFileSync(path, 'utf8');

const securityTools = ['base64-encoder', 'base64-decoder', 'uuid-generator', 'hash-generator', 'jwt-decoder', 'password-generator'];
const designTools = ['color-picker', 'image-color-picker'];

function getCategoryData(slug, currentLabel) {
  if (securityTools.includes(slug)) return { name: "Security Tools", slug: "security-tools" };
  if (designTools.includes(slug)) return { name: "Design Tools", slug: "design-tools" };
  
  if (currentLabel === 'Document Tools') return { name: "PDF Tools", slug: "pdf-tools" };
  if (currentLabel === 'Video Tools' || currentLabel === 'Audio Tools') return { name: "Media Tools", slug: "media-tools" };
  if (currentLabel === 'Calculators') return { name: "Calculator Tools", slug: "calculator-tools" };
  
  const label = currentLabel;
  const slugCat = label.toLowerCase().replace(/\s+/g, '-');
  return { name: label, slug: slugCat };
}

content = content.replace(/"([^"]+)":\s*{\s*slug:\s*"([^"]+)",\s*title:\s*"([^"]+)",\s*description:\s*"([^"]+)",\s*category:\s*{\s*label:\s*"([^"]+)"[^\}]+},\s*Component:\s*([^,]+),?\s*}/g, (match, key, slug, title, desc, label, component) => {
   const cat = getCategoryData(slug, label);
   return `"${key}": {
    slug: "${slug}",
    title: "${title}",
    description: "${desc}",
    category: { name: "${cat.name}", slug: "${cat.slug}", href: "/categories/${cat.slug}" },
    Component: ${component},
  }`;
});

fs.writeFileSync(path, content);
console.log("Registry standardized!");
