import React from 'react'
/**
 * Footer component with styled layout.
 */
const footerLinks = [
  { label: '맛집/술집', href: '#' },
  { label: '카페', href: '#' },
  { label: '오락', href: '#' },
  { label: '쇼핑/기념품/전자담배', href: '#' },
  { label: '아이돌', href: '#' },
  { label: '기타', href: '#' },
];

const policyLinks = [
  { label: '이용약관', href: '#' },
  { label: '개인정보처리방침', href: '#' },
  { label: '환불규정', href: '#' },
];

const Footer = () => {
  return (
    <footer style={styles.footer}>
      {/* Top Section */}
      <div style={styles.footerTop}>
        {/* Left: Logo */}
        <div style={styles.footerColLeft}>
          <div style={styles.logoPlaceholder}>로고</div>
        </div>
        {/* Middle: Category Links */}
        <div style={styles.footerColMiddle}>
          <div style={styles.sectionTitle}>모든 카테고리</div>
          <nav>
            <ul style={styles.linkList}>
              {footerLinks.map((link) => (
                <li key={link.label} style={styles.linkListItem}>
                  <a href={link.href} style={styles.categoryLink}>{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        {/* Right: Company Info */}
        <div style={styles.footerColRight}>
          <div style={styles.sectionTitle}>
            아자오조가 만들어씀{' '}
          </div>
        </div>
      </div>
      {/* Bottom Section */}
      <div style={styles.footerBottom}>
        <div style={styles.bottomLinks}>
          {policyLinks.map((link, idx) => (
            <React.Fragment key={link.label}>
              <a href={link.href} style={styles.bottomLink}>{link.label}</a>
              {idx < policyLinks.length - 1 && (
                <span style={styles.bottomLinkDivider}>|</span>
              )}
            </React.Fragment>
          ))}
        </div>
        <div style={styles.companyInfo}>
          <div>상호명: (주)해커톤 | 대표: 홍길동 | 이메일: contact@company.com</div>
          <div>사업자번호: 123-45-67890 | 통신판매업신고번호: 2024-서울강남-0000</div>
          <div>주소: 서울특별시 강남구 테헤란로 123, 4층</div>
          <div style={styles.copyright}>
            &copy; {new Date().getFullYear()} (주)해커톤. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

// Simple external link SVG icon
function ExternalLinkIcon() {
  return (
    <svg width="16" height="16" fill="none" aria-label="외부 링크" viewBox="0 0 16 16" style={{ verticalAlign: 'middle' }}>
      <path d="M10.5 2H14v3.5M14 2l-7 7" stroke="#888" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="2.5" y="4.5" width="7" height="9" rx="1" stroke="#888" strokeWidth="1.2"/>
    </svg>
  );
}

// Styles (CSS-in-JS)
const styles = {
  footer: {
    background: '#fafbfc',
    borderTop: '1px solid #ececec',
    marginTop: 48,
    fontFamily: 'inherit',
  },
  footerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 32,
    maxWidth: 1200,
    width: '100%',
    margin: '0 auto',
    padding: '40px 4px 24px 4px',
    flexWrap: 'wrap',
  },
  footerColLeft: {
    flex: '1 1 120px',
    minWidth: 120,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  logoPlaceholder: {
    fontWeight: 700,
    fontSize: 20,
    letterSpacing: '0.05em',
    background: '#e5e7eb',
    color: '#888',
    borderRadius: 8,
    width: 80,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerColMiddle: {
    flex: '2 1 260px',
    minWidth: 220,
    paddingLeft: 12,
  },
  footerColRight: {
    flex: '1 1 160px',
    minWidth: 150,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  sectionTitle: {
    fontWeight: 600,
    fontSize: 16,
    marginBottom: 12,
    color: '#23272f',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  linkList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  linkListItem: {},
  categoryLink: {
    textDecoration: 'none',
    color: '#57596b',
    fontSize: 15,
    transition: 'color 0.15s',
    fontWeight: 400,
  },
  externalIconLink: {
    marginLeft: 4,
    display: 'inline-flex',
    verticalAlign: 'middle',
  },
  footerBottom: {
    borderTop: '1px solid #ececec',
    marginTop: 24,
    padding: '20px 4px 32px 4px',
    maxWidth: 1200,
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    color: '#888',
    fontSize: 13,
    background: '#fafbfc',
  },
  bottomLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  bottomLink: {
    color: '#888',
    textDecoration: 'none',
    fontWeight: 500,
    fontSize: 13,
    transition: 'color 0.15s',
  },
  bottomLinkDivider: {
    margin: '0 6px',
    color: '#d1d5db',
    userSelect: 'none',
  },
  companyInfo: {
    lineHeight: 1.7,
    color: '#888',
    fontSize: 13,
    marginTop: 2,
  },
  copyright: {
    marginTop: 4,
    color: '#b0b2b8',
    fontSize: 12,
  },
};

export default Footer