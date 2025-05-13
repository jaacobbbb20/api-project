import { useModal } from "../../context/Modal"

const OpenModelMenuItem = ({
  modalComponent,
  itemText,
  onItemClick,
  onModalClose
}) => {
  const { setModalContent, setOnModalClose } = useModal();

  const handleClick = () => {
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (typeof onItemClick === "function") onItemClick();
  };

  return (
    <button onClick={handleClick}>{itemText}</button>
  );
}

export default OpenModelMenuItem;