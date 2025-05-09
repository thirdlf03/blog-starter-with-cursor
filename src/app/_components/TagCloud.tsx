"use client"; // クライアントコンポーネントとして指定

import Link from 'next/link';

type Props = {
  tags: { [tag: string]: number };
};

const TagCloud = ({ tags }: Props) => {
  if (Object.keys(tags).length === 0) {
    return null;
  }

  // タグの出現頻度に基づいてフォントサイズを計算する簡単なロジック
  // 最小フォントサイズと最大フォントサイズを定義
  const minFontSize = 12; // px
  const maxFontSize = 24; // px

  const frequencies = Object.values(tags);
  const minFreq = Math.min(...frequencies);
  const maxFreq = Math.max(...frequencies);

  // フォントサイズを正規化する関数
  const calculateFontSize = (freq: number) => {
    if (minFreq === maxFreq) { // 全てのタグが同じ頻度の場合
      return (minFontSize + maxFontSize) / 2;
    }
    // 頻度を0-1の範囲に正規化し、フォントサイズ範囲にマッピング
    const normalizedFreq = (freq - minFreq) / (maxFreq - minFreq);
    return minFontSize + normalizedFreq * (maxFontSize - minFontSize);
  };

  return (
    <div style={{ marginTop: '20px', marginBottom: '20px', padding: '15px', border: '1px solid #eee', borderRadius: '8px' }}>
      <h3 style={{ marginTop: 0, marginBottom: '15px', fontSize: '1.4em' }}>タグクラウド</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
        {Object.entries(tags).map(([tag, freq]) => (
          <Link
            href={`/tags/${encodeURIComponent(tag)}`} // タグごとの記事一覧ページへのリンク（後で作成が必要）
            key={tag}
            style={{
              fontSize: `${calculateFontSize(freq)}px`,
              textDecoration: 'none',
              color: '#0070f3', // Next.jsの青色
              padding: '5px 8px',
              backgroundColor: '#f0f0f0',
              borderRadius: '4px',
              transition: 'background-color 0.2s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#e0e0e0')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
          >
            {tag} ({freq})
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TagCloud; 