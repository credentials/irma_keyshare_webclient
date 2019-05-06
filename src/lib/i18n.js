import en from './translations/en';
import nl from './translations/nl';

const translationLanguages = {en, nl};

export const createT = (language) => {
  const translations = translationLanguages[language] || translationLanguages.en;

  return (scope) => {
    const translation = translations[scope];
    if(translation === undefined) {
      debugger;
      return <span style={{color: 'red'}}>(translation '{ scope }' missing)</span>
    }

  return translation;
  }
};