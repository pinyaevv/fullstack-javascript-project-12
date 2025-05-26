import {
  Formik,
  Form,
  Field,
  ErrorMessage,
} from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'

const MessageForm = ({ onSendMessage, disabled }) => {
  const { t } = useTranslation()

  const validationSchema = Yup.object({
    messageText: Yup.string()
      .trim()
      .required(t('validation.required_field')),
  })

  return (
    <Formik
      initialValues={{ messageText: '' }}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        onSendMessage(values.messageText)
        resetForm()
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className="input-group">
            <Field
              name="messageText"
              type="text"
              className="form-control"
              placeholder={t('ui_interface.message_placeholder')}
              aria-label={t('ui_interface.new_message')}
              disabled={disabled}
              autoComplete="off"
              autoFocus
            />
            <button
              className="btn btn-primary"
              type="submit"
              disabled={disabled || isSubmitting}
            >
              {t('ui_interface.send')}
            </button>
          </div>
          <ErrorMessage
            name="messageText"
            component="div"
            className="text-danger mt-1"
          />
        </Form>
      )}
    </Formik>
  )
}

export default MessageForm
