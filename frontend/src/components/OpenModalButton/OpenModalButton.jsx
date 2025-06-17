import { useModal } from "../../context/Modal";

function OpenModalButton({
  buttonText,
  modalComponent,
  onModalClose,
  className,
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (onModalClose) setOnModalClose(() => onModalClose);
    setModalContent(modalComponent);
  };

  return (
    <button onClick={onClick} className={className}>
      {buttonText}
    </button>
  );
}

export default OpenModalButton;
