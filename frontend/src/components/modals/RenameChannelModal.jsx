import { Modal, Button } from 'react-bootstrap'
import {
  Formik, Field, Form, ErrorMessage,
} from 'formik'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { renameChannel } from '../../app/features/channels/chanSlice.js'

const RenameChannelModal = ({ show, onHide, channel }) => {
  const dispatch = useDispatch()
  const { items: channels = [] } = useSelector(state => state.channels)
  const { t } = useTranslation()
  const [error, setError] = useState(null)

  if (!channel) return null

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, t('validation.min_3_max_20'))
      .max(20, t('validation.min_3_max_20'))
      .required(t('validation.required_field'))
      .test(
        'unique-name',
        t('validation.channel_exists'),
        name => !channels.some(ch => ch.name === name && ch.id !== channel.id),
      ),
  })

  const handleSubmit = async (values, { setSubmitting }) => {
    setError(null)
    try {
      await dispatch(renameChannel({
        id: channel.id,
        name: values.name,
      })).unwrap()
      onHide()
    }
    catch (err) {
      console.error(t('errors.renaming_error'), err)
      setError(t('errors.renaming_error'))
    }
    finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('modal_window.rename_channel')}</Modal.Title>
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
                  placeholder={t('modal_window.channel_name')}
                  aria-label={t('modal_window.channel_name')}
                  autoFocus
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-danger mt-1"
                />
              </div>
              {error && <div className="text-danger mb-3">{error}</div>}
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
                {isSubmitting ? `${t('ui_interface.save')}...` : `${t('ui_interface.save')}`}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

export default RenameChannelModal
