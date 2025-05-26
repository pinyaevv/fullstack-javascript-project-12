import { Dropdown, Button } from 'react-bootstrap'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ModalFacade from './ModalFacade'

const ChannelList = ({ channels = [], currentChannel, onChannelSelect }) => {
  const [modal, setModal] = useState({ type: null, channel: null })
  const { t } = useTranslation()

  const handleModalClose = () => setModal({ type: null, channel: null })

  return (
    <div className="channels-sidebar">
      <div className="d-flex justify-content-between mb-3">
        <h4>{t('ui_interface.channels')}</h4>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => setModal({ type: 'add', channel: null })}
        >
          +
        </Button>
      </div>
      <ul className="list-unstyled">
        {channels.map(channel => (
          <li
            key={channel.id}
            className={`d-flex align-items-center justify-content-between px-2 py-1 rounded mb-1 ${channel.id === currentChannel?.id ? 'bg-light' : ''}`}
          >
            <button
              type="button"
              className="btn btn-link text-decoration-none text-start flex-grow-1 me-2"
              onClick={() => onChannelSelect(channel)}
              style={{
                color: '#000',
                fontWeight: channel.id === currentChannel?.id ? 'bold' : 'normal',
              }}
            >
              #
              {channel.name}
            </button>

            {channel.removable && (
              <Dropdown onClick={e => e.stopPropagation()}>
                <Dropdown.Toggle
                  variant="secondary"
                  size="sm"
                  className="border-0 bg-secondary-subtle"
                >
                  <i className="bi bi-chevron-down" />
                  <span className="visually-hidden">{t('ui_interface.channel_menu')}</span>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={(e) => {
                      e.stopPropagation()
                      setModal({ type: 'rename', channel })
                    }}
                  >
                    {t('ui_interface.rename')}
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={(e) => {
                      e.stopPropagation()
                      setModal({ type: 'delete', channel })
                    }}
                  >
                    {t('ui_interface.delete')}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </li>
        ))}
      </ul>

      <ModalFacade modal={modal} onHide={handleModalClose} />
    </div>
  )
}

export default ChannelList
