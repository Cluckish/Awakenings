document.getElementById('current-year').textContent = new Date().getFullYear();
AOS.init({ duration: 600, once: true });

/* Lottie animation script removed
try {
    const heartAnimContainer = document.getElementById('heart-animation');
    if(heartAnimContainer && (typeof heartAnimContainer.style.display === 'undefined' || heartAnimContainer.style.display !== 'none')) { 
        lottie.loadAnimation({
          container: heartAnimContainer,
          path: 'https://assets7.lottiefiles.com/packages/lf20_heart.json', 
          renderer: 'svg', loop: true, autoplay: true
        });
    }
} catch (e) {
    console.error("Lottie animation could not be loaded.", e);
    const heartAnimContainer = document.getElementById('heart-animation');
    if(heartAnimContainer) heartAnimContainer.style.display = 'none';
}
*/

const toTop = document.getElementById('to-top');
if (toTop) toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' })); // Added null check for toTop

const siteHeader = document.getElementById('site-header');
const h1Title = siteHeader ? siteHeader.querySelector('h1') : null; // Added null check
const titleFull = h1Title ? h1Title.querySelector('.title-full') : null;
const titleShort = h1Title ? h1Title.querySelector('.title-short') : null;
const headerFavicon = h1Title ? h1Title.querySelector('.header-favicon') : null;
// const navLinks = siteHeader ? Array.from(siteHeader.querySelectorAll('nav .nav-link')) : []; // navLinks not used in current script

const initialHeaderHeightVh = 30;
const finalHeaderHeightPx = 60;

let initialH1FontSizeRem = 2.5; 
if(h1Title) {
    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const computedFontSize = parseFloat(getComputedStyle(h1Title).fontSize);
    if (rootFontSize > 0 && computedFontSize > 0) { // Check for valid numbers
        initialH1FontSizeRem = computedFontSize / rootFontSize;
    }
}

const finalH1DesktopFontSizeRem = 1.5;
const finalH1MobileFontSizeRem = 1.0; 

const initialH1ColorHex = "#27296d"; 
const finalH1ColorHex = "#FFFFFF";   
// const initialNavLinkColorHex = "#27296d"; // Not used
// const finalNavLinkColorHex = "#FFFFFF";   // Not used

const animationScrollStart = 0;
const animationScrollEnd = 200; 

function hexToRgb(hex) {
    let r = 0, g = 0, b = 0;
    if (hex.length == 4) { 
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length == 7) { 
        r = parseInt(hex[1] + hex[2], 16);
        g = parseInt(hex[3] + hex[4], 16);
        b = parseInt(hex[5] + hex[6], 16);
    }
    return [r, g, b];
}

const initialH1ColorRgb = hexToRgb(initialH1ColorHex);
const finalH1ColorRgb = hexToRgb(finalH1ColorHex);
// const initialNavLinkColorRgb = hexToRgb(initialNavLinkColorHex); // Not used
// const finalNavLinkColorRgb = hexToRgb(finalNavLinkColorHex); // Not used

function interpolateValue(start, end, progress) {
    return start + (end - start) * progress;
}

function interpolateRgbColor(colorStartRgb, colorEndRgb, progress) {
    const r = Math.round(interpolateValue(colorStartRgb[0], colorEndRgb[0], progress));
    const g = Math.round(interpolateValue(colorStartRgb[1], colorEndRgb[1], progress));
    const b = Math.round(interpolateValue(colorStartRgb[2], colorEndRgb[2], progress));
    return `rgb(${r},${g},${b})`;
}

let lastKnownScrollY = 0;
let ticking = false;

function updateHeaderStylesOnScroll(scrollY) {
  if (!siteHeader || !h1Title) return; // Guard if elements are not found

  let progress = 0;
  if (scrollY <= animationScrollStart) {
    progress = 0;
  } else if (scrollY >= animationScrollEnd) {
    progress = 1;
  } else {
    progress = (scrollY - animationScrollStart) / (animationScrollEnd - animationScrollStart);
  }
  progress = Math.max(0, Math.min(1, progress));

  requestAnimationFrame(() => {
    const initialHeaderActualHeight = (initialHeaderHeightVh / 100) * window.innerHeight;
    siteHeader.style.height = `${interpolateValue(initialHeaderActualHeight, finalHeaderHeightPx, progress)}px`;

    let targetFinalH1FontSize = window.innerWidth <= 480 ? finalH1MobileFontSizeRem : finalH1DesktopFontSizeRem;
    let currentInitialH1Size = initialH1FontSizeRem;
    if (progress === 0 && h1Title.style.fontSize === '') {
         currentInitialH1Size = initialH1FontSizeRem;
    } else if (h1Title.style.fontSize) {
        currentInitialH1Size = parseFloat(h1Title.style.fontSize) || initialH1FontSizeRem;
    } 

    h1Title.style.fontSize = `${interpolateValue(currentInitialH1Size, targetFinalH1FontSize, progress)}rem`;
    
    if (titleFull) titleFull.style.opacity = 1 - progress;
    if (titleShort) titleShort.style.opacity = progress;
    if (headerFavicon) headerFavicon.style.opacity = progress;

    if (progress > 0.9) { 
        if (titleFull) titleFull.style.display = 'none';
        if (titleShort) titleShort.style.display = 'inline-block';
        if (headerFavicon) headerFavicon.style.display = 'inline-block';
    } else if (progress < 0.1) {
        if (titleFull) titleFull.style.display = 'inline-block';
        if (titleShort) titleShort.style.display = 'none';
        if (headerFavicon) headerFavicon.style.display = 'none';
    } else { 
        if (titleFull) titleFull.style.display = 'inline-block';
        if (titleShort) titleShort.style.display = 'inline-block';
        if (headerFavicon) headerFavicon.style.display = 'inline-block';
    }

    h1Title.style.color = interpolateRgbColor(initialH1ColorRgb, finalH1ColorRgb, progress);
    
    if (progress >= 0.95) { 
      siteHeader.classList.add('scrolled-header-layout');
    } else {
      siteHeader.classList.remove('scrolled-header-layout');
    }
  });
}

function setInitialH1FontSize() { // Helper to set initialH1FontSizeRem based on computed style
    if(h1Title) {
        const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
        const computedFontSize = parseFloat(getComputedStyle(h1Title).fontSize);
        if (rootFontSize > 0 && computedFontSize > 0) { 
            initialH1FontSizeRem = computedFontSize / rootFontSize;
        }
    }
}

window.addEventListener('scroll', () => {
    lastKnownScrollY = window.scrollY;
    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateHeaderStylesOnScroll(lastKnownScrollY);
            document.body.classList.toggle('scrolled', lastKnownScrollY > 50); 
            ticking = false;
        });
        ticking = true;
    }
});
window.addEventListener('resize', () => { 
    setInitialH1FontSize();
    updateHeaderStylesOnScroll(window.scrollY); 
});
document.addEventListener('DOMContentLoaded', () => { 
    setInitialH1FontSize();
    updateHeaderStylesOnScroll(window.scrollY); 
});

const applySystemTheme = (isDark) => {
    document.documentElement.classList.toggle('dark', isDark);
    if (typeof AOS !== 'undefined') AOS.refreshHard(); 
    let currentBg = getComputedStyle(document.documentElement).getPropertyValue(isDark ? '--bg-dark' : '--bg-light').trim();
    document.querySelectorAll('.separator path').forEach(p => p.style.fill = currentBg);
};

const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
applySystemTheme(prefersDarkScheme.matches); 
prefersDarkScheme.addEventListener('change', (e) => applySystemTheme(e.matches));

window.addEventListener('load', function() {
  if (typeof AOS !== 'undefined') setTimeout(() => AOS.refreshHard(), 1200); 
  setInitialH1FontSize();
  updateHeaderStylesOnScroll(window.scrollY); 
});

const accordionHeaders = document.querySelectorAll('.accordion .acc-header');
if (accordionHeaders.length > 0) {
    accordionHeaders.forEach(btn => {
      btn.addEventListener('click', () => {
        btn.classList.toggle('active');
        const body = btn.nextElementSibling;
        body.style.maxHeight = btn.classList.contains('active') ? body.scrollHeight + 'px' : '0';
      });
    });
}

const lazyIframes = document.querySelectorAll('iframe.lazy-embed');
if (lazyIframes.length > 0) {
    lazyIframes.forEach(iframe => { 
      if (iframe.classList.contains('skeleton')) { 
          iframe.addEventListener('load', () => {
              iframe.classList.remove('skeleton');
              if (typeof AOS !== 'undefined') { 
                AOS.refresh(); 
              }
          });
      }
    });
}