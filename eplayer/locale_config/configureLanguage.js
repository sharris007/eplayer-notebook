export default function languageName(languageID){

	var locale="";

	switch(languageID){
		case 1: locale = "en-US";
				break;
		case 2: locale = "en-US-HE";
				break;
		case 3: locale = "en-CA";
				break;
		case 4: locale = "it-IT";
				break;
		case 5: locale = "es-US-CG";
				break;
		case 6: locale = "de-DE";
				break;
		case 7: locale = "nl-NL";
				break;
		case 8: locale = "fr";
				break;
		case 9: locale = "fr-FR-CG";
				break;
		case 10: locale = "fr-FR-C-HE";
				break;
		case 11: locale = "fr-FR-C-CG";
				break;
		case 12: locale = "ja-JP";
				break;
		case 13: locale = "ko-KR";
				break;
		case 14: locale = "sv-SE";
				break;
		case 15: locale = "zh-CN";
				break;
		case 16: locale = "en-CA-PS";
				break;
		case 17: locale = "en-CA-ER";
				break;
		case 18: locale = "pt-PT";
				break;
		case 19: locale = "ar-AR";
				break;
		case 20: locale = "no-NO";
				break;
		case 21: locale = "tr-TR";
				break;
		case 22: locale = "pl-PL";
				break;
		case 23: locale = "zh-TW";
				break;
		case 24: locale = "en-GB";
				break;
		case 25: locale = "ru-RU";
				break;
		case 26: locale = "es-ES-CS";
				break;
		case 27: locale = "es-MX-LA";
				break;
		case 28: locale = "pt-BR";
				break;
		default: locale = "en";
				break;
	}
	return locale;
};

