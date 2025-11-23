import { useTranslation } from 'react-i18next';
import docsContentEn from '@/data/docsContent.json';
import docsContentPt from '@/data/docsContentPt.json';

export const useDocsContent = () => {
  const { i18n } = useTranslation();

  // Default to English if language is not supported or content is missing
  const content = i18n.language === 'pt' ? docsContentPt : docsContentEn;

  return content;
};
