import { Modal, Form, Button } from 'react-bootstrap';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { hasProfanity } from '../../utils/profanityFilter.js';
import { addChannel } from '../../app/features/channels/chanSlice.js';

const AddChannelModal = ({ show, onHide }) => {
  const dispatch = useDispatch();
  const { items: channels = [] } = useSelector((state) => state.channels);
  const { t } = useTranslation();
  const [setError] = useState(null);

  const schema = Yup.object().shape({
    name: Yup.string()
      .min(3, t('validation.min_3_max_20'))
      .max(20, t('validation.min_3_max_20'))
      .required(t('validation.required_field'))
      .test(
        'unique-name',
        t('validation.channel_exists'),
        (name) => !channels.some((chan) => chan.name === name),
      ),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm, setFieldError }) => {
    setError(null);

    if (hasProfanity(values.name)) {
      toast.error(t('profanity.has_profanity'));
      setError(t('profanity.has_profanity'));
      setFieldError('name', t('profanity.has_profanity'));
      setSubmitting(false);
      return;
    }

    try {
      await dispatch(addChannel(values.name)).unwrap();
      resetForm();
      onHide();
    } catch (error) {
      console.error(t('errors.network_error'), error);
      setError(t('errors.network_error'));
      setFieldError('name', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Formik
        initialValues={{ name: '' }}
        validationSchema={schema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form onSubmit={handleSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>{t('modal_window.create_channel')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Field
                name="name"
                type="text"
                className="form-control mb-2"
                placeholder={t('modal_window.channel_name')}
                autoFocus
              />
              <ErrorMessage name="name" component="div" className="text-danger" />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={onHide}>
                {t('ui_interface.cancel')}
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? `${t('ui_interface.create')}...` : `${t('ui_interface.create')}`}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default AddChannelModal;
