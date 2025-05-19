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
          <li key={channel.id}>
            <button
              type="button"
              className={`w-100 text-start p-2 d-flex justify-content-between align-items-center ${channel.id === currentChannel?.id ? 'active' : ''}`}
              onClick={() => onChannelSelect(channel)}
            >
              {channel.name}
            </button>
            <span className="flex-grow-1 channel-name">
              #
              {channel.name}
            </span>

            {channel.removable && (
            <Dropdown onClick={(e) => e.stopPropagation()}>
              <Dropdown.Toggle
                variant="light"
                size="sm"
                className="p-1 channel-menu-toggle"
                id={`dropdown-${channel.id}`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="5" r="2" />
                  <circle cx="12" cy="12" r="2" />
                  <circle cx="12" cy="19" r="2" />
                </svg>
              </Dropdown.Toggle>

              <Dropdown.Menu className="dropdown-menu-up">
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
