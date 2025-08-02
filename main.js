// main.js
import puppeteer from 'puppeteer';
import path from 'path';
import config from 'config';
import downloadImage from './download.js';

const headless_mode = process.argv[2];

let target = 0;
let downloaded = 0;

const requestPage = async (req) => {
	const url = req.url();

	if (url.startsWith('https://media.discordapp.net/attachments/') && req.resourceType() === 'image') {
		const imageUrl = url.split(/\?format=|\?width=/gu)[0];
		const imageName = path.win32.basename(imageUrl);
		const destPath = `./spider/${imageName}`;
		target += 1;

		console.log(`Image downloading: ${imageUrl}`);
		if (config.get('showDownloadDetails')) {
			console.log('→ Target:', destPath);
		}

		try {
			await downloadImage(imageUrl, destPath, config.get('showDownloadDetails'));
			downloaded += 1;
			console.log(`✅ Image saved: ${imageName} (${downloaded}/${target})`);
		} catch (err) {
			console.error(`❌ Failed to download ${imageUrl}:`, err.message);
		}
	}
};

const scrollable_selector =
	'#app-mount > div.app-3xd6d0 > div > div.layers-OrUESM.layers-1YQhyW > div > div > div > div > div.chat-2ZfjoI > div.content-1jQy2l > main > div.messagesWrapper-RpOMA3.group-spacing-16 > div';
const evaluatePage = async (page) => {
	await page.evaluate((selector) => {
		const el = document.querySelector(selector);
		if (el) el.scrollTop += 1000;
	}, scrollable_selector);
};

const main = async () => {
	const browser = await puppeteer.launch({
		headless: headless_mode !== 'true',
		defaultViewport: null,
		ignoreHTTPSErrors: true,
		slowMo: 0,
	});

	const pages = await browser.pages();
	const page = pages[0];
	await page.setUserAgent('Chrome');

	await page.goto(`https://discord.com/channels/${config.get('serverID')}/${config.get('channelID')}/0`, {
		waitUntil: 'networkidle0',
	});

	page.on('request', (req) => {
		requestPage(req);
	});

	await page.waitForSelector(scrollable_selector, { timeout: 0 });

	setInterval(evaluatePage(page), 500);
};

(async () => {
	await main();
})().catch((e) => {
	console.error(`${e}`);
});
