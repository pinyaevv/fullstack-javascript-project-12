import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const LoginSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Слишком короткое!')
    .required('Обязательное поле'),
  password: Yup.string()
    .min(6, 'Пароль слишком короткий')
    .required('Введите пароль'),
});

export default function LoginPage() {
  return (
    <div>
      <h1>Вход в чат</h1>
      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={(values) => {
          console.log('Данные формы:', values);
        }}
      >
        {() => (
          <Form>
            <div>
              <label htmlFor="username">Имя пользователя</label>
              <Field name="username" type="text" />
              <ErrorMessage name="username" component="div" />
            </div>

            <div>
              <label htmlFor="password">Пароль</label>
              <Field name="password" type="password" />
              <ErrorMessage name="password" component="div" />
            </div>

            <button type="submit">Войти</button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
