import { Font } from '@react-pdf/renderer';

Font.register({
  family: 'Pretendard',
  fonts: [
    { src: '/fonts/Pretendard-Light.otf', fontWeight: 300 },
    { src: '/fonts/Pretendard-Regular.otf', fontWeight: 400 },
    { src: '/fonts/Pretendard-Bold.otf', fontWeight: 700 },
  ],
});
