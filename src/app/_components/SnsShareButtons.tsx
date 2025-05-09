"use client"; // クライアントコンポーネントとして指定

import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  HatenaShareButton,
  HatenaIcon,
} from "react-share"; // react-shareも必要なので後でインストールします

type Props = {
  url: string;
  title: string;
};

const SnsShareButtons = ({ url, title }: Props) => {
  return (
    <div style={{ display: "flex", gap: "10px", marginTop: "20px", marginBottom: "20px" }}>
      <TwitterShareButton url={url} title={title}>
        <TwitterIcon size={32} round />
      </TwitterShareButton>
      <FacebookShareButton url={url} title={title}>
        <FacebookIcon size={32} round />
      </FacebookShareButton>
      <HatenaShareButton url={url} title={title}>
        <HatenaIcon size={32} round />
      </HatenaShareButton>
    </div>
  );
};

export default SnsShareButtons; 