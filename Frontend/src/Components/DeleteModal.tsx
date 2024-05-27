import { FC, ReactNode } from "react";

interface DeleteModalProps {
  isOpen: boolean;
  toggleOpen: () => void;
  children: ReactNode;
}

const DeleteModal: FC<DeleteModalProps> = ({
  isOpen,
  toggleOpen,
  children,
}) => {
  return (
    <div className={`overlay ${isOpen ? "open" : ""}`} onClick={toggleOpen}>
      <div className="modal">{children}</div>
    </div>
  );
};

export default DeleteModal;
