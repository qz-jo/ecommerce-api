import Button from './Button'
import Modal from './Modal'

export default function ConfirmDialog({ open, title, description, confirmLabel = 'Confirm', danger = false, onConfirm, onClose }) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      actions={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm}>{confirmLabel}</Button>
        </>
      }
    >
      <p>{description}</p>
    </Modal>
  )
}
