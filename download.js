// download.js
import fs from 'fs-extra';
import got from 'got';
import path from 'path';
import cliProgress from 'cli-progress';

const downloadImage = async (url, outputPath, showProgress = false) => {
	await fs.ensureDir(path.dirname(outputPath));

	let bar;
	if (showProgress) {
		bar = new cliProgress.SingleBar(
			{
				format: `${path.basename(outputPath)} |{bar}| {percentage}% | {value}/{total} bytes`,
				clearOnComplete: true,
				hideCursor: true,
			},
			cliProgress.Presets.shades_classic,
		);
	}

	const stream = got.stream(url);

	if (showProgress) {
		stream.on('downloadProgress', (progress) => {
			if (progress.total) {
				bar.setTotal(progress.total);
				bar.update(progress.transferred);
			}
		});
		stream.on('end', () => {
			bar.stop();
		});
	}

	const fileStream = fs.createWriteStream(outputPath);

	await new Promise((resolve, reject) => {
		stream.pipe(fileStream);
		stream.on('error', reject);
		fileStream.on('finish', resolve);
		fileStream.on('error', reject);
	});
};

export default downloadImage;
