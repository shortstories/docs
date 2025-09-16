import React, { useEffect } from 'react';
import './styles.module.css';
import SnowfallCanvas from './SnowfallCanvas';

interface SocialLink {
  id: string;
  href: string;
  label: string;
  svg: JSX.Element;
}

interface PageLink {
  title: string;
  href: string;
  img: string; // 이미지 파일명 (public 경로)
  alt: string;
}

const socialLinks: SocialLink[] = [
  {
    id: 'github',
    href: 'https://github.com/shortstories',
    label: 'GitHub',
    svg: (
      <svg className="social-icon-fill" width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.7998 28.2998C19.3998 28.2998 18.9998 27.9998 18.9998 27.4998V20.1998C18.9998 18.9998 18.9998 18.4998 18.4998 17.9998C18.2998 17.7998 18.1998 17.4998 18.2998 17.1998C18.3998 16.8998 18.5998 16.6998 18.8998 16.6998C22.4998 16.2998 24.6998 15.0998 24.6998 9.99982C24.6998 8.69982 24.1998 7.39982 23.2998 6.49982C23.0998 6.29982 22.9998 5.99982 23.0998 5.69982C23.2998 5.09982 23.3998 4.59982 23.3998 3.99982C23.3998 3.59982 23.2998 3.09982 23.1998 2.69982C22.6998 2.79982 21.5998 2.99982 19.7998 4.19982C19.5998 4.29982 19.3998 4.29982 19.1998 4.29982C16.7998 3.69982 14.1998 3.69982 11.7998 4.29982C11.5998 4.39982 11.3998 4.29982 11.1998 4.19982C9.3998 3.09982 8.2998 2.79982 7.7998 2.79982C7.6998 3.19982 7.5998 3.59982 7.5998 4.09982C7.5998 4.69982 7.6998 5.29982 7.8998 5.79982C7.9998 6.09982 7.8998 6.39982 7.6998 6.59982C7.1998 7.09982 6.8998 7.59982 6.5998 8.19982C6.3998 8.79982 6.1998 9.39982 6.1998 10.0998C6.1998 15.0998 8.3998 16.3998 11.9998 16.7998C12.2998 16.7998 12.4998 16.9998 12.5998 17.2998C12.6998 17.5998 12.5998 17.8998 12.3998 18.0998C11.9998 18.4998 11.7998 19.2998 11.8998 20.4998V22.4998V22.5998V27.5998C11.8998 27.9998 11.5998 28.3998 11.0998 28.3998C10.5998 28.3998 10.2998 28.0998 10.2998 27.5998V23.5998C6.9998 24.1998 5.6998 22.1998 4.8998 20.7998C4.4998 20.0998 4.0998 19.4998 3.6998 19.3998C3.2998 19.2998 3.0998 18.8998 3.1998 18.4998C3.2998 18.0998 3.6998 17.8998 4.0998 17.9998C5.0998 18.2998 5.6998 19.1998 6.1998 20.0998C7.0998 21.4998 7.7998 22.7998 10.3998 22.1998V20.7998C10.2998 19.7998 10.3998 18.9998 10.5998 18.3998C7.4998 17.7998 4.5998 16.1998 4.5998 10.3998C4.5998 9.49982 4.7998 8.69982 5.0998 7.89982C5.4998 6.99982 5.8998 6.39982 6.2998 5.89982C6.1998 5.29982 6.0998 4.69982 6.0998 3.99982C6.0998 3.19982 6.2998 2.39982 6.5998 1.69982C6.6998 1.49982 6.8998 1.29982 7.0998 1.29982C7.3998 1.19982 8.7998 0.999818 11.7998 2.79982C14.2998 2.19982 16.8998 2.19982 19.2998 2.79982C22.2998 0.999818 23.6998 1.19982 23.9998 1.29982C24.1998 1.39982 24.3998 1.49982 24.4998 1.69982C24.7998 2.39982 24.9998 3.19982 24.9998 3.99982C24.9998 4.59982 24.8998 5.29982 24.7998 5.89982C25.7998 7.09982 26.3998 8.49982 26.3998 10.0998C26.3998 15.8998 23.5998 17.5998 20.4998 18.0998C20.6998 18.7998 20.6998 19.4998 20.6998 20.1998V27.4998C20.5998 27.9998 20.1998 28.2998 19.7998 28.2998Z" fill="white" />
      </svg>
    )
  },
  {
    id: 'instagram',
    href: 'https://www.instagram.com/kwonsci/',
    label: 'Instagram',
    svg: (
      <svg className="social-icon-fill" width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M0.25 9C0.25 4.16751 4.16751 0.25 9 0.25H21C25.8325 0.25 29.75 4.16751 29.75 9V21C29.75 25.8325 25.8325 29.75 21 29.75H9C4.16751 29.75 0.25 25.8325 0.25 21V9ZM9 1.75C4.99594 1.75 1.75 4.99594 1.75 9V21C1.75 25.0041 4.99594 28.25 9 28.25H21C25.0041 28.25 28.25 25.0041 28.25 21V9C28.25 4.99594 25.0041 1.75 21 1.75H9ZM24 7.75H22V6.25H24V7.75ZM8.25 15C8.25 11.2721 11.2721 8.25 15 8.25C18.7279 8.25 21.75 11.2721 21.75 15C21.75 18.7279 18.7279 21.75 15 21.75C11.2721 21.75 8.25 18.7279 8.25 15ZM15 9.75C12.1005 9.75 9.75 12.1005 9.75 15C9.75 17.8995 12.1005 20.25 15 20.25C17.8995 20.25 20.25 17.8995 20.25 15C20.25 12.1005 17.8995 9.75 15 9.75Z" fill="white" />
      </svg>
    )
  },
  {
    id: 'facebook',
    href: 'https://www.facebook.com/ohchang.kwon.18/',
    label: 'Facebook',
    svg: (
      <svg className="social-icon-fill" width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M0.25 15C0.25 6.8538 6.8538 0.25 15 0.25C23.1462 0.25 29.75 6.8538 29.75 15C29.75 23.1462 23.1462 29.75 15 29.75C6.8538 29.75 0.25 23.1462 0.25 15ZM15 1.75C7.68223 1.75 1.75 7.68223 1.75 15C1.75 22.0661 7.28116 27.8403 14.25 28.2291V17.75H10V16.25H14.25V13C14.25 10.3766 16.3766 8.25 19 8.25H20V9.75H19C17.2051 9.75 15.75 11.2051 15.75 13V16.25H20V17.75H15.75V28.2291C22.7188 27.8403 28.25 22.0661 28.25 15C28.25 7.68223 22.3178 1.75 15 1.75Z" fill="white" />
      </svg>
    )
  },
  {
    id: 'linkedin',
    href: 'https://www.linkedin.com/in/%EC%98%A4%EC%B0%BD-%EA%B6%8C-b37709310/',
    label: 'LinkedIn',
    svg: (
      <svg className="social-icon-fill" width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M0.25 3C0.25 1.48122 1.48122 0.25 3 0.25H27C28.5188 0.25 29.75 1.48122 29.75 3V27C29.75 28.5188 28.5188 29.75 27 29.75H3C1.48122 29.75 0.25 28.5188 0.25 27V3ZM3 1.75C2.30964 1.75 1.75 2.30964 1.75 3V27C1.75 27.6904 2.30964 28.25 3 28.25H27C27.6904 28.25 28.25 27.6904 28.25 27V3C28.25 2.30964 27.6904 1.75 27 1.75H3ZM10 9.75H8V8.25H10V9.75ZM8.25 22V12H9.75V22H8.25ZM12.25 12H13.75V13.5359C14.5997 12.7384 15.7428 12.25 17 12.25C19.6234 12.25 21.75 14.3766 21.75 17V22H20.25V17C20.25 15.2051 18.7949 13.75 17 13.75C15.2051 13.75 13.75 15.2051 13.75 17V22H12.25V12Z" fill="white" />
      </svg>
    )
  }
];

const pageLinks: PageLink[] = [
  { title: 'Mail - shortstories@ocha.ng', href: 'mailto:shortstories@ocha.ng', img: require('@site/static/img/links/mail.png').default, alt: 'Mail - shortstories@ocha.ng' },
  // 이미 @site 절대 경로 사용 중이므로 유지
  { title: 'Memo - GitBook', href: 'https://docs.ocha.ng', img: require('@site/static/img/links/gitbook.png').default, alt: 'Memo - GitBook' },
  { title: 'Photos - Immich', href: 'https://photos.ocha.ng', img: require('@site/static/img/links/immich.png').default, alt: 'Photos - Immich' },
  { title: 'NAS - NextCloud', href: 'https://nas.ocha.ng', img: require('@site/static/img/links/nextcloud.png').default, alt: 'NAS - NextCloud' },
  { title: 'IOT - HomeAssistant', href: 'https://iot.ocha.ng', img: require('@site/static/img/links/homeassistant.png').default, alt: 'IOT - HomeAssistant' },
  { title: 'Media - Jellyfin', href: 'https://jellyfin.ocha.ng', img: require('@site/static/img/links/jellyfin.png').default, alt: 'Media - Jellyfin' },
  { title: 'Torrent - Transmission', href: 'https://torrent.ocha.ng', img: require('@site/static/img/links/transmission.png').default, alt: 'Torrent - Transmission' },
  { title: 'DNS - AdGuard Home', href: 'https://adguard.ocha.ng', img: require('@site/static/img/links/adguard.png').default, alt: 'AdGuard Home' },
  { title: 'Monitoring - Grafana', href: 'https://grafana.ocha.ng', img: require('@site/static/img/links/grafana.png').default, alt: 'Monitoring - Grafana' },
  { title: 'LocalAI - Ollama', href: 'https://ai.ocha.ng', img: require('@site/static/img/links/ollama.png').default, alt: 'LocalAI - Ollama' }
];

const IndexPage: React.FC = () => {
  return (
    <div className="min-h-full flex-h-center" id="background_div">
      {/* hidden inputs (원본 구조 유지 필요 시) */}
      <input type="hidden" value="https://bio.link" id="app-url" />
      <input type="hidden" value="null" id="is-featured" />
      <SnowfallCanvas id="bg-canvas" className="background-overlay" options={{ color: 'white', count: 500 }} />
      <img className="page-image" src={require('@site/static/img/links/snowy.png').default} alt="background" />
      <canvas id="bg-canvas" className="background-overlay" />

      <div className="mt-24 page-full-wrap relative">
        <input type="hidden" value="creator-page" id="page-type" />
        {/* <h2 className="page-title page-text-color page-text-font mt-16 text-center">Links</h2> */}
        <div className="flex-both-center flex-wrap mt-24">
          {socialLinks.map((s) => (
            <div key={s.id} className="page-social relative">
              <a className="social-icon-anchor" data-id={s.id} data-type="social_link" target="_blank" rel="noreferrer" href={s.href} aria-label={s.label}></a>
              {s.svg}
            </div>
          ))}
        </div>
        <div className="mt-24">
          {pageLinks.map((l) => (
            <div key={l.href} className="page-item-wrap relative">
              <div className="page-item flex-both-center absolute" />
              <a target="_blank" rel="noreferrer" className="page-item-each py-10 flex-both-center" href={l.href} data-id="261652" data-type="page_item">
                <img className="link-each-image" src={l.img} alt={l.alt} />
                <span className="item-title text-center">{l.title}</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
