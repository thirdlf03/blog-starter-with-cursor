import { remark } from "remark";
import html from "remark-html";
// @ts-ignore TODO: Add type definition for open-graph-scraper
import ogs from 'open-graph-scraper';

// OGP画像のURLを安全に取得するヘルパー関数
function getImageUrl(ogImage: any): string {
  if (!ogImage) return '';
  
  // 配列の場合は最初の要素を使用
  if (Array.isArray(ogImage) && ogImage.length > 0 && ogImage[0]?.url) {
    return ogImage[0].url;
  }
  
  // オブジェクトの場合はurlプロパティを使用
  if (typeof ogImage === 'object' && ogImage?.url) {
    return ogImage.url;
  }
  
  // 文字列の場合はそのまま返す（URLとして扱える場合）
  if (typeof ogImage === 'string') {
    return ogImage;
  }
  
  return '';
}

export default async function markdownToHtml(markdown: string) {
  // まずは通常のremarkでMarkdownをHTMLに変換
  const result = await remark().use(html).process(markdown);
  let content = result.toString();

  // Spotifyリンクを検出して、iframeタグに置換
  // 通常のSpotifyリンクと、すでにembed形式になっているリンクの両方に対応
  content = content.replace(
    /<p>(https:\/\/open\.spotify\.com\/(?:embed\/)?(playlist|track|album)\/([a-zA-Z0-9]+)(\?.*)?)<\/p>/g,
    (match, url, type, id) => {
      // すでにembed形式の場合はそのまま使用し、そうでなければembed形式に変換
      const src = url.includes('/embed/') ? url : `https://open.spotify.com/embed/${type}/${id}`;
      return `<iframe src="${src}" width="100%" height="152" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`;
    }
  );

  // 一般的なURLを検出してOGPカードに置換
  // ただし、SpotifyのURLは上記で処理済みのため除外する
  // また、画像URLなども対象外とする（例: .jpg, .png, .gifで終わるURL）
  const urlRegex = /<p>(https?:\/\/[^\s<]+)<\/p>/g;
  let match;
  const promises = [];

  while ((match = urlRegex.exec(content)) !== null) {
    const url = match[1];

    // SpotifyのURLと画像URLはOGPカード処理の対象外
    if (url.includes('open.spotify.com') || /\.(jpeg|jpg|gif|png)$/i.test(url)) {
      continue;
    }

    promises.push(
      (async () => {
        try {
          const { result: ogpData } = await ogs({ url });
          if (ogpData && ogpData.ogTitle) {
            const cardHtml = `
              <div style="border: 1px solid #ddd; border-radius: 8px; margin: 16px 0; overflow: hidden; text-decoration: none; color: inherit; display: block;">
                ${ogpData.ogImage ? `<img src="${getImageUrl(ogpData.ogImage)}" alt="${ogpData.ogTitle}" style="width: 100%; height: auto; max-height: 300px; object-fit: cover;">` : ''}
                <div style="padding: 16px;">
                  <h3 style="margin-top: 0; margin-bottom: 8px; font-size: 1.2em;">${ogpData.ogTitle}</h3>
                  ${ogpData.ogDescription ? `<p style="margin-top: 0; margin-bottom: 8px; font-size: 0.9em; color: #555;">${ogpData.ogDescription}</p>` : ''}
                  ${ogpData.ogSiteName || new URL(url).hostname ? `<p style="margin-top: 0; margin-bottom: 0; font-size: 0.8em; color: #777;">${ogpData.ogSiteName || new URL(url).hostname}</p>` : ''}
                </div>
              </div>
            `;
            content = content.replace(match[0], cardHtml);
          }
        } catch (error) {
          console.error(`Error fetching OGP data for ${url}: `, error);
          // エラーが発生した場合は、元のURLリンクのままにするか、代替表示をする
          // ここでは元のpタグで囲まれたURLのままにする
        }
      })()
    );
  }

  await Promise.all(promises);

  return content;
}
