/* public/consent-init.js */
window.addEventListener('load', () => {
  const cc = initCookieConsent();

  // Dil içerikleri (kısaltılmış)
  const tr = { consent_modal:{ title:'Çerezler', description:'Analitik çerez...', primary_btn:{text:'Kabul',role:'accept_all'}, secondary_btn:{text:'Reddet',role:'accept_necessary'}} };
  const en = { consent_modal:{ title:'Cookies', description:'We use analytics...', primary_btn:{text:'Accept',role:'accept_all'}, secondary_btn:{text:'Decline',role:'accept_necessary'}} };

  const lang = navigator.language.startsWith('tr') ? 'tr' : 'en';

  cc.run({
    current_lang: lang,
    autoclear_cookies: true,
    page_scripts: true,
    languages: { tr, en },
    onAccept: () => {
      if (cc.allowedCategory('analytics')) loadGA();
    }
  });

  function loadGA() {
    if (window.GA_LOADED) return;
    window.GA_LOADED = true;
    const id = 'G-KYX2KYQW3B';             
    const s1 = document.createElement('script');
    s1.async = true;
    s1.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(s1);

    const s2 = document.createElement('script');
    s2.innerHTML =
      `window.dataLayer = window.dataLayer || [];
       function gtag(){dataLayer.push(arguments);}
       gtag('js', new Date());
       gtag('config', '${id}', { anonymize_ip: true });`;
    document.head.appendChild(s2);
  }
});
