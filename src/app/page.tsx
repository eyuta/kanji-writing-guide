"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image"; // or import Image from 'react-bootstrap/Image';
import SearchBox from "./searchBox";
import Link from "next/link";

type ImageLinkObject = {
  src: string;
  link: string;
};

const INPUT_TEXT_KEY = "inputTextKey";

const Home = () => {
  const [inputText, setInputText] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(INPUT_TEXT_KEY) ?? "";
    }
    return "";
  });
  const [imageSrcArray, setImageSrcArray] = useState<ImageLinkObject[]>([]);

  // 入力値が変更されたらローカルストレージに保存
  const handleInputChange = (newValue: string) => {
    setInputText(newValue);
    localStorage.setItem(INPUT_TEXT_KEY, newValue); // ここで保存
  };

  useEffect(() => {
    const fetchImage = async (unicode: string) => {
      const cachedSrc = localStorage.getItem(unicode);
      if (cachedSrc) {
        try {
          return JSON.parse(cachedSrc) as ImageLinkObject;
        } catch (error) {
          localStorage.removeItem(unicode);
        }
      }
      const response = await axios.get(`/api/scrape?unicode=${unicode}`);
      const imgSrc = response.data.imgSrc;
      const linkUrl = `https://mojinavi.com/d/u${unicode}`;
      const imageLinkObj = { src: imgSrc, link: linkUrl };
      localStorage.setItem(unicode, JSON.stringify(imageLinkObj));
      return imageLinkObj;
    };

    const extractAndFetchImages = async (text: string) => {
      const kanjiPattern = /[\u4e00-\u9faf]/g;
      const kanjiArray = text.match(kanjiPattern) || [];
      const uniqueKanjiArray = Array.from(new Set(kanjiArray));

      const imgSrcArray = await Promise.all(
        uniqueKanjiArray.map((kanji) => {
          const unicode = kanji.codePointAt(0)?.toString(16).padStart(4, "0");
          if (unicode) return fetchImage(unicode);
          return null;
        })
      );

      setImageSrcArray(
        imgSrcArray
          .filter(Boolean)
          .filter((imgSrc) =>
            imgSrc?.src.includes("media.mojinavi.com")
          ) as ImageLinkObject[]
      );
    };

    extractAndFetchImages(inputText);
  }, [inputText]);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl mb-4">漢字書き順ガイド</h1>

      <SearchBox initialValue={inputText} onSearch={handleInputChange} />

      <div className="grid grid-cols-3 gap-4 mt-8">
        {imageSrcArray.map(({ src, link }, index) => (
          <div key={index}>
            <Link href={link} passHref>
              <Image
                key={index}
                src={src}
                width={400}
                height={400}
                alt="Kanji"
              />
            </Link>
          </div>
        ))}
      </div>

      <div>
        引用元:{" "}
        <a
          href={"https://mojinavi.com"}
          target="_blank"
          rel="noopener noreferrer"
        >
          モジナビ
        </a>
      </div>
    </div>
  );
};

export default Home;
