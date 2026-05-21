const BIZ = {
  name:       '컬러랩',
  ceo:        '이형진',
  regNo:      '602-18-97643',
  mailOrder:  '제2026-경기양주-1851호',
  address:    '경기도 양주시 삼숭로58번길 108-11 704-103',
  email:      'kumokiri@naver.com',
  phone:      '010-2060-7039',
} as const;

export default function BusinessInfo() {
  return (
    <address className="not-italic text-xs leading-relaxed text-gray-400 dark:text-gray-500">
      <span>상호: {BIZ.name}</span>
      <span className="mx-1.5 opacity-40">|</span>
      <span>대표자: {BIZ.ceo}</span>
      <br />
      <span>사업자등록번호: {BIZ.regNo}</span>
      <br />
      <span>통신판매업 신고번호: {BIZ.mailOrder}</span>
      <br />
      <span>주소: {BIZ.address}</span>
      <br />
      <span>이메일: </span>
      <a
        href={`mailto:${BIZ.email}`}
        className="hover:text-violet-500 dark:hover:text-purple-400 transition-colors"
      >
        {BIZ.email}
      </a>
      <span className="mx-1.5 opacity-40">|</span>
      <span>전화: {BIZ.phone}</span>
    </address>
  );
}
