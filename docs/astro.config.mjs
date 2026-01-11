// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Dreamplet',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/marepilc/dreamplet' }],
			sidebar: [
				{
					label: 'Guides',
					items: [
						{ label: 'Getting Started', slug: 'guides/getting-started' },
					],
				},
				{
					label: 'Reference',
					items: [
						{ label: 'Engine', slug: 'reference/engine' },
						{ label: 'Primitives', slug: 'reference/primitives' },
					],
				},
			],
		}),
	],
});
