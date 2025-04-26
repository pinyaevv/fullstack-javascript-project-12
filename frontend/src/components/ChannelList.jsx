import { Dropdown, Button } from 'react-bootstrap';
import { AddChannelModal } from './modals/AddChannelModal';
import { DeleteChannelModal } from './modals/DeleteChannelModal';
import { RenameChannelModal } from './modals/RenameChannelModal';
import { useState } from 'react';

export const ChannelList = ({ channels = [], currentChannel, onChannelSelect }) => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showRenameModal, setShowRenameModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedChannel, setSelectedChannel] = useState(null);

    return (
      <div className="channels-sidebar">
          <div className="d-flex justify-content-between mb-3">
              <h4>Каналы</h4>
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
                      className={`d-flex justify-content-between align-items-center p-2 ${channel.id === currentChannel?.id ? 'active' : ''}`}
                      onClick={() => onChannelSelect(channel)}
                  >
                      <span className="flex-grow-1 channel-name">
                          #{channel.name}
                      </span>
                      
                      <Dropdown onClick={(e) => e.stopPropagation()}>
                          <Dropdown.Toggle 
                              variant="light" 
                              size="sm" 
                              className="p-1 channel-menu-toggle"
                              id={`dropdown-${channel.id}`}
                          >Открыть</Dropdown.Toggle>
                          
                          <Dropdown.Menu>
                              <Dropdown.Item 
                                  onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedChannel(channel);
                                      setShowRenameModal(true);
                                  }}
                              >
                                  Переименовать
                              </Dropdown.Item>
                              <Dropdown.Item
                                  disabled={channel.id === 1}
                                  onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedChannel(channel);
                                      setShowDeleteModal(true);
                                  }}
                              >
                                  Удалить
                              </Dropdown.Item>
                          </Dropdown.Menu>
                      </Dropdown>
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