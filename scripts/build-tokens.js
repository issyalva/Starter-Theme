import StyleDictionary from 'style-dictionary';
import config from '../style-dictionary.config.js';

console.log('🎨 Building design tokens...\n');

const sd = new StyleDictionary(config);

await sd.buildAllPlatforms();

console.log('✅ Design tokens built successfully!');
console.log('📁 Output files:');
console.log('   - tokens/build/tokens.css (CSS variables)');
console.log(
  '   - tokens/build/tailwind.theme.css (Tailwind theme extension)\n'
);
