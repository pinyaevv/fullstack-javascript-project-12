import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { login } from '../api/auth.js';
import { useNavigate } from 'react-router-dom';
import { Alert } from 'react-bootstrap';

const LoginSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Слишком короткое!')
    .required('Обязательное поле'),
  password: Yup.string()
    .min(3, 'Пароль слишком короткий')
    .required('Введите пароль'),
});

export default function LoginPage() {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    console.log('Отправка данных:', values);
    try {
      const token = await login(values.username, values.password);
      console.log('Полученный токен:', token);
      localStorage.setItem('token', token);
      navigate('/');
    } catch (err) {
      console.error('Полная ошибка:', error);
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Вход в чат</h1>
      {error && <Alert variant='danger'>{error}</Alert>}
      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="mb-3">
              <label htmlFor="username" className="form-lable">Имя пользователя</label>
              <Field name="username" type="text" className="form-control" />
              <ErrorMessage name="username" component="div" className="text-danger" />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-lable">Пароль</label>
              <Field name="password" type="password" className="form-control" />
              <ErrorMessage name="password" component="div" className="text-danger" />
            </div>

            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Вход...' : 'Войти'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};
