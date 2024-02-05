import json from '@rollup/plugin-json';
import commonjs from "@rollup/plugin-commonjs";
import terser from '@rollup/plugin-terser';

export default [
	{
		input: 'src/1.1.1.1.panel.js',
		output: {
			file: 'js/1.1.1.1.panel.js',
			format: 'es',
			banner: '/* README: https://github.com/VirgilClyne/Cloudflare */',
		},
		plugins: [json(), commonjs(), terser()]
	},
	{
		input: 'src/1.1.1.1.request.js',
		output: {
			file: 'js/1.1.1.1.request.js',
			format: 'es',
			banner: '/* README: https://github.com/VirgilClyne/Cloudflare */',
		},
		plugins: [json(), commonjs(), terser()]
	},
	{
		input: 'src/1.1.1.1.response.js',
		output: {
			file: 'js/1.1.1.1.response.js',
			format: 'es',
			banner: '/* README: https://github.com/VirgilClyne/Cloudflare */',
		},
		plugins: [json(), commonjs(), terser()]
	},
	{
		input: 'src/DNS.js',
		output: {
			file: 'js/DNS.js',
			format: 'es',
			banner: '/* README: https://github.com/VirgilClyne/Cloudflare */',
		},
		plugins: [json(), commonjs(), terser()]
	},
];
