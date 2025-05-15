import React, { useState, useRef, useEffect } from 'react';
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

  const usernameInput = useRef(null);

  useEffect(() => {
    if (usernameInput.current) {
      usernameInput.current.focus();
    }
  }, []);

  const LoginSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, t('validation.min_3'))
      .required(t('validation.required_field')),
    password: Yup.string()
      .min(3, t('validation.min_3'))
      .required(t('validation.required_field')),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const token = await login(values.username, values.password, t);
      dispatch(setCredentials({
        token: token,
        username: values.username,
      }));
      localStorage.setItem('token', token);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err?.response?.status === 401
        ? t('errors.incorrect_login_or_password')
        : t('errors.network_error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1>{t('ui_interface.login')}</h1>
      {error && <Alert variant='danger'>{error}</Alert>}
      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="mb-3">
              <Field
                placeholder={t('form.username')}
                name="username"
                type="text"
                className="form-control"
                innerRef={usernameInput}
              />
              <ErrorMessage name="username" component="div" className="text-danger" />
            </div>

            <div className="mb-3">
              <Field name="password" type="password" className="form-control" placeholder={t('form.password')}/>
              <ErrorMessage name="password" component="div" className="text-danger" />
            </div>

            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? `${t('ui_interface.login')}...` : `${t('ui_interface.login')}`}
            </button>

            <div className="mt-3">
              {t('auth.no_account')} <Link to="/signup">{t('auth.register')}</Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
