import React, { useState, useRef, useEffect } from 'react';
import {
  Formik, Field, Form, ErrorMessage,
} from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { setCredentials } from '../app/features/auth/authSlice.js';
import { login } from '../api/auth.js';

const LoginPage = () => {
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
      .required(t('validation.incorrect_name_or_pas')),
    password: Yup.string()
      .min(3, t('validation.min_3'))
      .required(t('validation.incorrect_name_or_pas')),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const token = await login(values.username, values.password, t);
      dispatch(setCredentials({
        token,
        username: values.username,
      }));
      localStorage.setItem('token', token);
      navigate('/', { replace: true });
    } catch (err) {
      if (err?.response && err.response.status === 401) {
        setError(t('errors.incorrect_login_or_password'));
      } else {
        setError(t('errors.network_error'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="w-100" style={{ maxWidth: '400px' }}>
        <h1 className="text-center">{t('ui_interface.login')}</h1>

        {error && <Alert variant="danger">{error}</Alert>}

        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
          validateOnBlur={false}
          validateOnChange={false}
        >
          {({ isSubmitting }) => (
            <>
              <Form>
                <div className="mb-3">
                  <label htmlFor="username">{t('form.nickname')}</label>
                  <Field
                    id="username"
                    placeholder={t('form.nickname')}
                    name="username"
                    type="text"
                    className="form-control"
                    innerRef={usernameInput}
                    data-testid="username"
                    autoFocus
                  />
                  <ErrorMessage name="username" component="div" className="text-danger" />
                </div>

                <div className="mb-3">
                  <label htmlFor="password">{t('form.password')}</label>
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    className="form-control"
                    placeholder={t('form.password')}
                  />
                  <ErrorMessage name="password" component="div" className="text-danger" />
                </div>

                <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                  {isSubmitting ? `${t('ui_interface.login')}...` : `${t('ui_interface.login')}`}
                </button>
              </Form>

              <div className="mt-3 text-center">
                {t('auth.no_account')}
                {' '}
                <Link to="/signup">{t('auth.register')}</Link>
              </div>
            </>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default LoginPage;
