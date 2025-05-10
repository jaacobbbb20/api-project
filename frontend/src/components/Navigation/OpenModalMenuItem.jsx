import React from "react"
import { useModal } from "../../context/Modal"
import OpenModalButton from "../OpenModalButton/OpenModalButton"
import { NavLink } from 'react-router-dom'

function openModelMenuItem({
  modalComponent,
  itemText,
  onItemClick,
  onModalClose
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (typeof onItemClick === "function") onItemClick();
  };

  return (
    <button onClick={onClick}>{itemText}</button>
  );
}

export default openModelMenuItem;