import AddChannelModal from './modals/AddChannelModal.jsx'
import DeleteChannelModal from './modals/DeleteChannelModal.jsx'
import RenameChannelModal from './modals/RenameChannelModal.jsx'

const ModalFacade = ({ modal, onHide }) => {
  const { type, channel } = modal

  if (!type) return null

  switch (type) {
    case 'add':
      return <AddChannelModal show onHide={onHide} />
    case 'rename':
      return <RenameChannelModal show onHide={onHide} channel={channel} />
    case 'delete':
      return <DeleteChannelModal show onHide={onHide} channel={channel} />
    default:
      return null
  }
}

export default ModalFacade
