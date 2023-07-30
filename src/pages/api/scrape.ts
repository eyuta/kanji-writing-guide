import axios from "axios";
import { JSDOM } from "jsdom";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // リクエストから漢字のUnicodeを取得
  const unicode = req.query.unicode as string;

  // 対象URLの設定
  const url = `https://mojinavi.com/d/u${unicode}`;

  try {
    // URLからHTMLを取得
    const { data } = await axios.get(url);

    // JSDOMでHTMLを解析
    const dom = new JSDOM(data);

    // 画像のsrc属性を取得

    const imgElement = dom.window.document.querySelector("div.center img");

    // imgElementがHTMLImageElementであることを確認してからsrcを取得
    if (imgElement) {
      const imgSrc = imgElement.getAttribute("src");
      res.status(200).json({ imgSrc });
    } else {
      res.status(404).json({ error: "Image not found" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while scraping the website" });
  }
}
