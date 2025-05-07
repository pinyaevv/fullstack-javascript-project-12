import { Modal, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { removeChannel } from '../../app/features/channels/chanSlice.js';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

export const DeleteChannelModal = ({ show, onHide, channel }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [error, setError] = useState(null);

    if (!channel?.id) return null;

    const handleDelete = async () => {
        if (!channel?.id) {
            console.error(t('errors.channel_id_missing'));
            return;
        }

        setError(null);
        try {
            await dispatch(removeChannel(channel.id)).unwrap();
            onHide();
        } catch (error) {
            console.error(t('errors.error'), error);
            setError(t('errors.delete_error'));
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>{t('modal_window.delete_channel')} "{channel?.name}"?</Modal.Title>
            </Modal.Header>
            <Modal.Body>{t('modal_window.delete_channel_confirmation')}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>{t('ui_interface.cancel')}</Button>
                <Button variant="danger" onClick={handleDelete} disabled={!channel?.id}>{t('ui_interface.delete')}</Button>
            </Modal.Footer>
        </Modal>
    );
};
