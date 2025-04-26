import { Modal, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { removeChannel } from '../../app/features/channels/chanSlice.js';

export const DeleteChannelModal = ({ show, onHide, channel }) => {
    const dispatch = useDispatch();

    const handleDelete = async () => {
        if (!channel?.id) {
            console.error('Channel ID is missing');
            return;
        }

        try {
            await dispatch(removeChannel(channel.id));
            onHide();
        } catch (error) {
            console.error('Ошибка:', error);
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Удалить канал "{channel?.name}"?</Modal.Title>
            </Modal.Header>
            <Modal.Body>Это действие нельзя отменить.</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Отмена</Button>
                <Button variant="danger" onClick={handleDelete} disabled={!channel?.id}>Удалить</Button>
            </Modal.Footer>
        </Modal>
    );
};
