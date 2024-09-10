import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import fr from './JSON/fr.translates.json';
import mg from './JSON/mg.translates.json'; 
i18n
  .use(initReactI18next)
  .init({
    resources: {
      fr: {
        translation: fr
      },
      mg: {
        translation: mg 
      }
    },
    lng: 'fr', // langue par défaut (français)
    fallbackLng: 'fr', // langue de secours
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
