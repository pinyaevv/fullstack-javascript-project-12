import { Dropdown, Button } from 'react-bootstrap';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AddChannelModal from './modals/AddChannelModal.jsx';
import DeleteChannelModal from './modals/DeleteChannelModal.jsx';
import RenameChannelModal from './modals/RenameChannelModal.jsx';

const ChannelList = ({ channels = [], currentChannel, onChannelSelect }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const { t } = useTranslation();

  return (
    <div className="channels-sidebar">
      <div className="d-flex justify-content-between mb-3">
        <h4>{t('ui_interface.channels')}</h4>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => setShowAddModal(true)}
        >
          +
        </Button>
      </div>
      <ul className="list-unstyled">
        {channels.map((channel) => (
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
              <Dropdown onClick={(e) => e.stopPropagation()}>
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
                      e.stopPropagation();
                      setSelectedChannel(channel);
                      setShowRenameModal(true);
                    }}
                  >
                    {t('ui_interface.rename')}
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedChannel(channel);
                      setShowDeleteModal(true);
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

      <AddChannelModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
      />
      <RenameChannelModal
        show={showRenameModal}
        onHide={() => {
          setShowRenameModal(false);
          setSelectedChannel(null);
        }}
        channel={selectedChannel}
      />
      <DeleteChannelModal
        show={showDeleteModal}
        onHide={() => {
          setShowDeleteModal(false);
          setSelectedChannel(null);
        }}
        channel={selectedChannel}
      />
    </div>
  );
};

export default ChannelList;
