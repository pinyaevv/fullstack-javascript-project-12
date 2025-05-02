import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { login } from '../api/auth.js';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Alert } from 'react-bootstrap';
import { setCredentials } from '../app/features/auth/authSlice.js';
import { useTranslation } from 'react-i18next';

export default function LoginPage() {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const LoginSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, t('min_3'))
      .required(t('required_field')),
    password: Yup.string()
      .min(3, t('min_3'))
      .required(t('required_field')),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    console.log('Отправка данных:', values);
    try {
      const token = await login(values.username, values.password, t);
      console.log('Полученный токен:', token);
      dispatch(setCredentials({
        token: token,
        username: values.username,
      }));
      localStorage.setItem('token', token);
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Полная ошибка:', err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1>{t('login')}</h1>
      {error && <Alert variant='danger'>{error}</Alert>}
      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">{t('username')}</label>
              <Field name="username" type="text" className="form-control" />
              <ErrorMessage name="username" component="div" className="text-danger" />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">{t('password')}</label>
              <Field name="password" type="password" className="form-control" />
              <ErrorMessage name="password" component="div" className="text-danger" />
            </div>

            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? `${t('login')}...` : `${t('login')}`}
            </button>

            <div className="mt-3">
              {t('no_account')} <Link to="/signup">{t('register')}</Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
