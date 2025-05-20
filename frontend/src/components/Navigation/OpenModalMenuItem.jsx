import { useModal } from "../../context/Modal";

const OpenModalMenuItem = ({
  modalComponent,
  itemText,
  onItemClick,
  onModalClose,
  className,
}) => {
  const { setModalContent, setOnModalClose } = useModal();

  const handleClick = () => {
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (typeof onItemClick === "function") onItemClick();
  };

  return (
    <button onClick={handleClick} className={className}>
      {itemText}
    </button>
  );
};

export default OpenModalMenuItem;