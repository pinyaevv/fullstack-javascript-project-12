import { Modal, Button } from 'react-bootstrap'
import {
  Formik, Form, Field, ErrorMessage,
} from 'formik'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { hasProfanity, filterProfanity } from '../../utils/profanityFilter.js'
import { addChannel } from '../../app/features/channels/chanSlice.js'

const AddChannelModal = ({ show, onHide }) => {
  const dispatch = useDispatch()
  const { items: channels = [] } = useSelector((state) => state.channels)
  const { t } = useTranslation()

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
  })

  const handleSubmit = async (values, { setSubmitting, resetForm, setFieldError }) => {
    const cleanName = filterProfanity(values.name)

    if (hasProfanity(values.name)) {
      try {
        await dispatch(addChannel(cleanName)).unwrap()
        toast.warning(t('profanity.cleaned_name_warning'))
        onHide()
      }
      catch {
        toast.error(t('errors.network'))
        setFieldError('name', t('errors.network'))
      }
      finally {
        setSubmitting(false)
      }
      return
    }

    try {
      await dispatch(addChannel(values.name)).unwrap()
      resetForm()
      onHide()
    }
    catch {
      setFieldError('name', t('errors.network_error'))
    }
    finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Formik
        initialValues={{ name: '' }}
        validationSchema={schema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <Modal.Header closeButton>
              <Modal.Title>{t('modal_window.create_channel')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Field
                name="name"
                type="text"
                className="form-control"
                placeholder={t('modal_window.channel_name')}
                aria-label={t('modal_window.channel_name')}
                autoFocus
              />
              <ErrorMessage name="name" component="div" className="text-danger" />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={onHide}>
                {t('ui_interface.cancel')}
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? `${t('ui_interface.create')}...` : t('ui_interface.create')}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

export default AddChannelModal
