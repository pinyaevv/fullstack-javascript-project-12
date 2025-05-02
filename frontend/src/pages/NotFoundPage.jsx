import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('404_error')}</h1>
      <Link to="/">{t('return_to_main')}</Link>
    </div>
  );
};
