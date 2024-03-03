import fs from "fs";
import satori from "satori";
import React from 'react'

(async () => {
    const fontData = fs.readFileSync("./font/NotoSansJP-Thin.ttf");
    // `satori()` で SVG を生成する
    const svg = await satori(
        // 第一引数に SVG に変換したい要素を渡す
        <div style={{ color: "red" }}> おはよう！ </div>,
        // 第二引数に幅、高さ、フォントなどのオプションを指定する
        {
            width: 600, // 幅
            height: 400, // 高さ
            fonts: [ // フォント
                {
                    name: "Roboto",
                    data: fontData,
                    weight: 400,
                    style: "normal",
                },
            ],
        }
    );

    console.log(svg);
    fs.writeFileSync("./output.svg", svg);
})();