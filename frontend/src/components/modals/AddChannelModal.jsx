import { Modal, Form, Button } from 'react-bootstrap';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { addChannel } from '../../app/features/channels/chanSlice.js';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

export const AddChannelModal = ({ show, onHide }) => {
    const dispatch = useDispatch();
    const { items: channels = [] } = useSelector((state) => state.channels);
    const { t } = useTranslation();
    const [error, setError] = useState(null);

    const schema = Yup.object().shape({
        name: Yup.string()
            .min(3, t('min_3_max_20'))
            .max(20, t('min_3_max_20'))
            .required(t('required_field'))
            .test(
                'unique-name', 
                t('channel_exists'), 
                (name) => !channels.some((chan) => chan.name === name)
            ),
    });

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        setError(null);
        try {
            await dispatch(addChannel(values.name)).unwrap();
            resetForm();
            onHide();
        } catch (error) {
            console.error(t('network_error'), error);
            setError(t('network_error'));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Formik
                initialValues={{ name: '' }}
                validationSchema={schema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, handleSubmit }) => (
                    <Form onSubmit={handleSubmit}>
                        <Modal.Header closeButton>
                            <Modal.Title>{t('create_channel')}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Field
                                name="name"
                                type="text"
                                className="form-control mb-2"
                                placeholder={t('channel_name')}
                                autoFocus
                            />
                            <ErrorMessage name="name" component="div" className="text-danger"/>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={onHide}>
                              {t('cancel')}
                            </Button>
                            <Button 
                                type="submit" 
                                variant="primary" 
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? `${t('creating')}...` : `${t('creating')}`}
                            </Button>
                        </Modal.Footer>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
};
