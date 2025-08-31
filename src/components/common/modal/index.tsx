import { FC } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-gray-900 rounded-lg border-2 border-yellow-400 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-yellow-400 hover:text-yellow-300 text-2xl font-bold z-10"
        >
          �
        </button>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};
