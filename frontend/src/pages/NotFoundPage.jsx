import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('errors.not_found_error')}</h1>
      <Link to="/">{t('ui_interface.return_to_main')}</Link>
    </div>
  );
};

export default NotFoundPage;
