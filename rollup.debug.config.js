import json from '@rollup/plugin-json';
import commonjs from "@rollup/plugin-commonjs";

export default [
	{
		input: 'src/1.1.1.1.panel.beta.js',
		output: {
			file: 'js/1.1.1.1.panel.beta.js',
			format: 'es',
			banner: '/* README: https://github.com/VirgilClyne/Cloudflare */',
		},
		plugins: [json(), commonjs()]
	},
	{
		input: 'src/1.1.1.1.request.beta.js',
		output: {
			file: 'js/1.1.1.1.request.beta.js',
			format: 'es',
			banner: '/* README: https://github.com/VirgilClyne/Cloudflare */',
		},
		plugins: [json(), commonjs()]
	},
	{
		input: 'src/1.1.1.1.response.beta.js',
		output: {
			file: 'js/1.1.1.1.response.beta.js',
			format: 'es',
			banner: '/* README: https://github.com/VirgilClyne/Cloudflare */',
		},
		plugins: [json(), commonjs()]
	},
	{
		input: 'src/DNS.beta.js',
		output: {
			file: 'js/DNS.beta.js',
			format: 'es',
			banner: '/* README: https://github.com/VirgilClyne/Cloudflare */',
		},
		plugins: [json(), commonjs()]
	},
];
