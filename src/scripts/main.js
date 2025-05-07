import '../css/styles.css';

document.addEventListener('DOMContentLoaded', async function() {
    const supportedLangs = ['de', 'en', 'es', 'fr', 'ja', 'pt'];
    const defaultLang = 'en';
    const basePath = window.location.pathname.includes('/-test-task') 
        ? '/-test-task' 
        : '';
    
    function getLanguage() {
        const urlParams = new URLSearchParams(window.location.search);
        const langParam = urlParams.get('lang');
        if (langParam && supportedLangs.includes(langParam)) {
            return langParam;
        }
        
        const browserLanguages = navigator.languages 
            ? [...navigator.languages] 
            : [navigator.language || 'en'];
        
        for (const language of browserLanguages) {
            const langCode = language.toLowerCase().split('-')[0];
            if (supportedLangs.includes(langCode)) {
                return langCode;
            }
        }
        
        return defaultLang;
    }
    
    async function loadTranslations(lang) {
        const translationUrl = `${basePath}/assets/locales/${lang}.json`;
        
        try {
            const response = await fetch(translationUrl);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error(`Error loading ${lang} translations:`, error);
            

            if (lang !== defaultLang) {
                return loadTranslations(defaultLang);
            }
            
            return {};
        }
    }
    
    function applyTranslations(translations) {
        if (!translations || typeof translations !== 'object') {
            console.error('Invalid translations data:', translations);
            return;
        }
        
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[key] !== undefined) {
                element.innerHTML = translations[key]
                    .replace(/\n/g, '<br>')
                    .replace('{{price}}', element.textContent.match(/\$\d+\.\d+/)?.[0] || '');
            }
        });
    }
    
    try {
        const lang = getLanguage();
        const translations = await loadTranslations(lang);
        applyTranslations(translations);
    } catch (error) {
        console.error('Initialization error:', error);
    }
});