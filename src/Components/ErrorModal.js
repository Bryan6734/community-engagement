import React, { useEffect, useState } from "react";
import { Modal } from "react-modal";

Modal.setAppElement("#root");

function ErrorModal() {
  const [modalIsOpen, setModalIsOpen] = useState(true);

  const closeModal = () => {
    setModalIsOpen(false);
  };
  return (
    <div className="ErrorModal">
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Error Modal"
        className="modal"
      >
        <p>Hello</p>
      </Modal>
    </div>
  );
}

export default ErrorModal;
