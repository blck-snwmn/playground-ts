import fs from "node:fs";
import satori from "satori";

(async () => {
	// const fontData = fs.readFileSync("./font/NotoSansJP-Thin.ttf");
	const xx = await fetch(
		"https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@700",
	);
	if (!xx.ok) {
		throw new Error("Failed to load font data");
	}
	const css = await xx.text();
	const resource = css.match(
		/src: url\((.+)\) format\('(opentype|truetype)'\)/,
	);
	if (!resource) {
		throw new Error("Failed to parse font data");
	}

	const zz = await fetch(resource[1]);
	const fontData = await zz.arrayBuffer();

	// `satori()` で SVG を生成する
	const svg = await satori(
		// 第一引数に SVG に変換したい要素を渡す
		<div style={{ color: "red" }}> hello </div>,
		// 第二引数に幅、高さ、フォントなどのオプションを指定する
		{
			width: 600, // 幅
			height: 400, // 高さ
			fonts: [
				// フォント
				{
					name: "Roboto",
					data: await fontData,
					weight: 400,
					style: "normal",
				},
			],
		},
	);

	console.log(svg);
	fs.writeFileSync("./output.svg", svg);
})();
