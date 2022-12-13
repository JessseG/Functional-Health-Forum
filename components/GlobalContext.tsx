import React, { useContext, createContext, useState } from "react";

type GlobalContextType = {
  modalOpen: boolean;
  toggleModal: () => void;
  modalMode: String;
  changeModalMode: (mode: String) => void;
};

export const GlobalContext = createContext<GlobalContextType>({
  modalOpen: false,
  toggleModal: () => {},
  modalMode: null,
  changeModalMode: (mode: String) => {},
});

type Props = {
  children: React.ReactNode;
};

export const GlobalProvider = ({ children }: Props) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<String>(null);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const changeModalMode = (mode: String) => {
    setModalMode(mode);
  };

  return (
    <GlobalContext.Provider
      value={{ modalOpen, toggleModal, modalMode, changeModalMode }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;
