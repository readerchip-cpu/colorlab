interface KakaoShareLink {
  mobileWebUrl?: string;
  webUrl?: string;
}

interface KakaoShareButton {
  title: string;
  link: KakaoShareLink;
}

interface KakaoShareContent {
  title: string;
  description?: string;
  imageUrl?: string;
  imageWidth?: number;
  imageHeight?: number;
  link: KakaoShareLink;
}

interface KakaoShareFeedOptions {
  objectType: 'feed';
  content: KakaoShareContent;
  buttons?: KakaoShareButton[];
}

interface Window {
  Kakao: {
    init(key: string): void;
    isInitialized(): boolean;
    Share: {
      sendDefault(options: KakaoShareFeedOptions): void;
    };
  };
}
