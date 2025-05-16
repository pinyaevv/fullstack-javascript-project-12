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
      .min(3, t('validation.min_3_max_20'))
      .max(20, t('validation.min_3_max_20'))
      .required(t('validation.required_field')),
    password: Yup.string()
      .min(6, t('validation.min_6'))
      .required(t('validation.required_field')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], t('validation.passwords_must_match'))
      .required(t('validation.required_field')),
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
      <h2 className="mb-4">{t('ui_interface.signup')}</h2>
      <Formik
        initialValues={{ username: '', password: '', confirmPassword: '' }}
        validationSchema={SignupSchema}
        onSubmit={handleSubmit}
        validateOnBlur={false}
        validateOnChange={false}
      >
        {({ isSubmitting, errors }) => (
          <Form>
            {errors.general && <Alert variant="danger">{errors.general}</Alert>}
            
            <div className="mb-3">
              <Field placeholder="Имя пользователя" name="username" type="text" className="form-control" autoFocus />
              <ErrorMessage name="username" component="div" className="text-danger" />
            </div>

            <div className="mb-3">
              <Field placeholder={t('form.password')} name="password" type="password" className="form-control" />
              <ErrorMessage name="password" component="div" className="text-danger" />
            </div>

            <div className="mb-3">
              <Field placeholder={t('form.confirm_password')} name="confirmPassword" type="password" className="form-control" />
              <ErrorMessage name="confirmPassword" component="div" className="text-danger" />
            </div>

            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? `${t('ui_interface.signup')}...` : `${t('ui_interface.signup')}`}
            </Button>

            <div className="mt-3">
              {t('auth.have_account')} <Link to="/login">{t('auth.login_link')}</Link>
            </div>
          </Form>
        )}
      </Formik>
    </Container>
  );
};