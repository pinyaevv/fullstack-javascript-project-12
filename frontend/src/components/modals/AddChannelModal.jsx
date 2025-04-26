import { Modal, Form, Button } from 'react-bootstrap';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { addChannel } from '../../app/features/channels/chanSlice.js';

export const AddChannelModal = ({ show, onHide }) => {
    const dispatch = useDispatch();
    const { items: channels = [] } = useSelector((state) => state.channels);

    const schema = Yup.object().shape({
        name: Yup.string()
            .min(3, 'Минимум 3 символа')
            .max(20, 'Максимум 20 символов')
            .required('Обязательное поле')
            .test(
                'unique-name', 
                'Канал уже существует', 
                (name) => !channels.some((chan) => chan.name === name)
            ),
    });

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            await dispatch(addChannel(values.name)).unwrap();
            resetForm();
            onHide();
        } catch (error) {
            console.error('Ошибка:', error);
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
                            <Modal.Title>Создать канал</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Field
                                name="name"
                                type="text"
                                className="form-control mb-2"
                                autoFocus
                            />
                            <ErrorMessage name="name" component="div" className="text-danger"/>
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
                                {isSubmitting ? 'Создание...' : 'Создать'}
                            </Button>
                        </Modal.Footer>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
};
