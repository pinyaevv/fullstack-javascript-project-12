import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../app/features/auth/authSlice.js';
import { Button, Container, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

export const SignupPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const SignupSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, t('min_3_max_20'))
      .max(20, t('min_3_max_20'))
      .required(t('required_field')),
    password: Yup.string()
      .min(6, t('min_6'))
      .required(t('required_field')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], t('passwords_must_match'))
      .required(t('required_field')),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      await dispatch(signup(values)).unwrap();
      navigate('/');
    } catch (error) {
      setErrors(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: '400px' }}>
      <h2 className="mb-4">{t('signup')}</h2>
      <Formik
        initialValues={{ username: '', password: '', confirmPassword: '' }}
        validationSchema={SignupSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors }) => (
          <Form>
            {errors.general && <Alert variant="danger">{errors.general}</Alert>}
            
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

            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">{t('confirm_password')}</label>
              <Field name="confirmPassword" type="password" className="form-control" />
              <ErrorMessage name="confirmPassword" component="div" className="text-danger" />
            </div>

            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? `${t('signup')}...` : `${t('signup')}`}
            </Button>

            <div className="mt-3">
              {t('have_account')} <Link to="/login">{t('login_link')}</Link>
            </div>
          </Form>
        )}
      </Formik>
    </Container>
  );
};