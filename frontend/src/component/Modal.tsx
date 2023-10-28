import { ModalProps, Modal as MuiModal } from '@mui/material';
import IcClose from 'src/image/ic-close.svg';

type Props = ModalProps & {
  handleClose: () => void;
  disableBackdropClick?: boolean;
};

const Modal = ({ open, handleClose, children, disableBackdropClick = false, ...props }: Props) => {
  const onCloseButtonClick = () => {
    handleClose();
  };

  const onMuiModalClose = (event: object, reason: string) => {
    if (!disableBackdropClick || reason !== 'backdropClick') handleClose();
  };

  return (
    <MuiModal open={open} onClose={onMuiModalClose} {...props}>
      <div className="xs:w-[480px] relative left-[50%] top-[50%] box-border max-h-[calc(100vh-140px)] w-[calc(100vw-30px)] translate-x-[-50%] translate-y-[-50%] rounded-[12px] bg-white px-0 py-[30px] outline-none">
        <img
          src={IcClose}
          className="absolute right-[10px] top-[10px] cursor-pointer"
          onClick={onCloseButtonClick}
        />
        <div className="max-h-[calc(100vh-140px-60px)] overflow-y-auto px-[30px] py-0">
          {children}
        </div>
      </div>
    </MuiModal>
  );
};

export default Modal;
