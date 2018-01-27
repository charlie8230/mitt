import buble from 'rollup-plugin-buble';
import flow from 'rollup-plugin-flow';
import fs from 'fs';

const pkg = JSON.parse(fs.readFileSync('./package.json'));
//	console.log(pkg);

export default {
	input: 'src/index.js',
	strict: false,
	// output: {sourceMap: true},
	plugins: [
		flow(),
		buble()
	],
	output: [
		{ file: pkg.main, format: 'cjs' },
		{ file: pkg.module, format: 'es' },
		{ file: pkg['umd:main'], format: 'umd', name: pkg.name }
	]
};
