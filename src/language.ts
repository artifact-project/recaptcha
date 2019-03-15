export type ReCaptchaLanguageCodes = 'ar'
	| 'af'
	| 'am'
	| 'hy'
	| 'az'
	| 'eu'
	| 'bn'
	| 'bg'
	| 'ca'
	| 'zh-HK'
	| 'zh-CN'
	| 'zh-TW'
	| 'hr'
	| 'cs'
	| 'da'
	| 'nl'
	| 'en-GB'
	| 'en'
	| 'et'
	| 'fil'
	| 'fi'
	| 'fr'
	| 'fr-CA'
	| 'gl'
	| 'ka'
	| 'de'
	| 'de-AT'
	| 'de-CH'
	| 'el'
	| 'gu'
	| 'iw'
	| 'hi'
	| 'hu'
	| 'is'
	| 'id'
	| 'it'
	| 'ja'
	| 'kn'
	| 'ko'
	| 'lo'
	| 'lv'
	| 'lt'
	| 'ms'
	| 'ml'
	| 'mr'
	| 'mn'
	| 'no'
	| 'fa'
	| 'pl'
	| 'pt'
	| 'pt-BR'
	| 'pt-PT'
	| 'ro'
	| 'ru'
	| 'sr'
	| 'si'
	| 'sk'
	| 'sl'
	| 'es'
	| 'es-419'
	| 'sw'
	| 'sv'
	| 'ta'
	| 'te'
	| 'th'
	| 'tr'
	| 'uk'
	| 'ur'
	| 'vi'
	| 'zu'
;

export type LanguageLocale = 'ru_RU'
	| 'en_US'
	| 'uk_UA'
	| 'ro_RO'
	| 'kk_KZ'
	| 'uz_UZ'
	| 'be_BY'
	| 'en_US'
	| 'es_ES'
	| 'hy_AM'
	| 'de_DE'
	| 'mo_MD'
;

const mapLanguageLocaleToReCaptchaLanguageCodes: {
	[K in LanguageLocale]: ReCaptchaLanguageCodes;
} = {
	'ru_RU': 'ru',
	'en_US': 'en',
	'uk_UA': 'uk', // Ukrainian
	'ro_RO': 'ro', // Romanian
	'mo_MD': 'ro', // Romanian
	'kk_KZ': 'ru', // Kazakhstan
	'uz_UZ': 'ru', // Uzbekistan
	'be_BY': 'ru', // Belarus
	'es_ES': 'es', // Spanish
	'hy_AM': 'hy', // Armenian
	'de_DE': 'de', // German
};

export function reLang(lang: ReCaptchaLanguageCodes | LanguageLocale): ReCaptchaLanguageCodes {
	return mapLanguageLocaleToReCaptchaLanguageCodes.hasOwnProperty(lang)
		? mapLanguageLocaleToReCaptchaLanguageCodes[lang]
		: lang
	;
}