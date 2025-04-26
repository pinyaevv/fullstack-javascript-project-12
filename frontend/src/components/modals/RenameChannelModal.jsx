import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { renameChannel } from '../../app/features/channels/chanSlice.js';

export const RenameChannelModal = ({ show, onHide, channel }) => {
  const dispatch = useDispatch();
  const { items: channels = [] } = useSelector((state) => state.channels);

  if (!channel) return null;

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, 'От 3 до 20 символов')
      .max(20, 'От 3 до 20 символов')
      .required('Обязательное поле')
      .test(
        'unique-name',
        'Канал с таким именем уже существует',
        (name) => !channels.some((ch) => ch.name === name && ch.id !== channel.id)
      ),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(renameChannel({
        id: channel.id, 
        name: values.name
      })).unwrap();
      onHide();
    } catch (error) {
      console.error('Ошибка переименования:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Переименовать канал</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{ name: channel.name }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <Modal.Body>
              <div className="mb-3">
                <Field
                  name="name"
                  type="text"
                  className="form-control"
                  autoFocus
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-danger mt-1"
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={onHide}>
                Отмена
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};
