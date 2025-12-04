import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import GlobalLoading from './GlobalLoading';
import { useTranslation } from 'react-i18next';
import UpgradeLoading from './UpgradeLoading';
import ResetWarn from '../alert/ResetWarn';
import LastLeftClickWarn from '../alert/LastLeftClickWarn';
import GameConfiguration from '../alert/GameConfiguration';
import MacroProductionModifionProhibited from '../alert/MacroProductionModifionProhibited';
import MacroMaximumWarn from '../alert/MacroMaximumWarn';
import MacroNameDuplicateWarn from '../alert/MacroNameDuplicateWarn';
import StartProgram from '../alert/StartProgram';
import MacroManager from '../alert/MacroManager';
type LoadingOptions = {
  proccess?: number;
  onOk?: () => void;
};

type ConfirmOptions = {
  onOk?: () => void;
  onCancel?: () => void;
};
type AlertOptions = {
  onOk?: () => void;
  onCancel?: () => void;
};

type ModalItem =
  | { type: 'loading'; id: string; options: LoadingOptions }
  | {
      type: 'lastLeftClickWarn';
      id: string;
      options: ConfirmOptions;
    }
  | {
      type: 'resetWarn';
      id: string;
      options: ConfirmOptions;
    }
  | {
      type: 'macroMaximumWarn';
      id: string;
      options: ConfirmOptions;
    }
  | {
      type: 'macroNameDuplicateWarn';
      id: string;
      options: ConfirmOptions;
    }
  | {
      type: 'macroProductionModifionProhibited';
      id: string;
      options: ConfirmOptions;
    }
  | {
      type: 'startProgram';
      id: string;
      options: ConfirmOptions;
    }
  | {
      type: 'gameConfiguration';
      id: string;
      options: ConfirmOptions;
    }
  | {
      type: 'macroManager';
      id: string;
      options: ConfirmOptions;
    };

type ModalContextType = {
  openConfigLoading: (options: LoadingOptions) => string;
  openResetWarn: (options: ConfirmOptions) => string;
  openLastLeftClickWarn: (options: ConfirmOptions) => string;
  openMacroMaximumWarn: (options: ConfirmOptions) => string;
  openMacroNameDuplicateWarn: (options: ConfirmOptions) => string;
  openMacroProductionModifionProhibited: (options: ConfirmOptions) => string;
  openStartProgram: (options: ConfirmOptions) => string;
  openGameConfiguration: (options: ConfirmOptions) => string;
  openMacroManager: (options: ConfirmOptions) => string;

  close: (id: string) => void;
  closeAll: () => void;
};

const ModalContext = createContext<ModalContextType | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modals, setModals] = useState<ModalItem[]>([]);

  const genId = () => Math.random().toString(36).slice(2);

  const openConfigLoading = (options: LoadingOptions) => {
    const id = genId();
    setModals((prev) => [...prev, { type: 'loading', id, options }]);
    return id;
  };

  const openResetWarn = (options: ConfirmOptions) => {
    const id = genId();
    setModals((prev) => [...prev, { type: 'resetWarn', id, options }]);
    return id;
  };
  const openLastLeftClickWarn = (options: ConfirmOptions) => {
    const id = genId();
    setModals((prev) => [...prev, { type: 'lastLeftClickWarn', id, options }]);
    return id;
  };

  const openMacroMaximumWarn = (options: ConfirmOptions) => {
    const id = genId();
    setModals((prev) => [...prev, { type: 'macroMaximumWarn', id, options }]);
    return id;
  };
  const openMacroNameDuplicateWarn = (options: ConfirmOptions) => {
    const id = genId();
    setModals((prev) => [...prev, { type: 'macroNameDuplicateWarn', id, options }]);
    return id;
  };
  const openMacroProductionModifionProhibited = (options: ConfirmOptions) => {
    const id = genId();
    setModals((prev) => [...prev, { type: 'macroProductionModifionProhibited', id, options }]);
    return id;
  };
  const openStartProgram = (options: ConfirmOptions) => {
    const id = genId();
    setModals((prev) => [...prev, { type: 'startProgram', id, options }]);
    return id;
  };
  const openGameConfiguration = (options: ConfirmOptions) => {
    const id = genId();
    setModals((prev) => [...prev, { type: 'gameConfiguration', id, options }]);
    return id;
  };
  const openMacroManager = (options: ConfirmOptions) => {
    const id = genId();
    setModals((prev) => [...prev, { type: 'macroManager', id, options }]);
    return id;
  };
  const close = (id: string) => {
    setModals((prev) => {
      return prev.filter((m) => m.id !== id);
    });
  };

  const closeAll = () => setModals([]);

  return (
    <ModalContext.Provider
      value={{
        openConfigLoading,
        close,
        closeAll,
        openResetWarn,
        openLastLeftClickWarn,
        openMacroNameDuplicateWarn,
        openMacroMaximumWarn,
        openMacroProductionModifionProhibited,
        openStartProgram,
        openMacroManager,
        openGameConfiguration,
      }}
    >
      {children}
      {createPortal(
        <div>
          {modals.map((m) => {
            if (m.type === 'loading') {
              return (
                <div className="global-loading-container" key={m.id}>
                  <GlobalLoading id={m.id} onClose={close} autoClose={false} />
                </div>
              );
            }
            if (m.type === 'resetWarn') {
              return (
                <div className="global-loading-container" key={m.id}>
                  <ResetWarn id={m.id} onClose={close} />
                </div>
              );
            }
            if (m.type === 'lastLeftClickWarn') {
              return (
                <div className="global-loading-container" key={m.id}>
                  <LastLeftClickWarn id={m.id} onClose={close} />
                </div>
              );
            }
            if (m.type === 'macroNameDuplicateWarn') {
              return (
                <div className="global-loading-container" key={m.id}>
                  <MacroNameDuplicateWarn id={m.id} onClose={close} />
                </div>
              );
            }

            if (m.type === 'macroMaximumWarn') {
              return (
                <div className="global-loading-container" key={m.id}>
                  <MacroMaximumWarn id={m.id} onClose={close} />
                </div>
              );
            }

            if (m.type === 'macroProductionModifionProhibited') {
              return (
                <div className="global-loading-container" key={m.id}>
                  <MacroProductionModifionProhibited id={m.id} onClose={close} />
                </div>
              );
            }
            if (m.type === 'startProgram') {
              return (
                <div className="global-loading-container" key={m.id}>
                  <StartProgram id={m.id} onClose={close} onOk={m.options.onOk} onCancel={m.options.onCancel} />
                </div>
              );
            }
            if (m.type === 'gameConfiguration') {
              return (
                <div className="global-loading-container" key={m.id}>
                  <GameConfiguration id={m.id} onClose={close} onOk={m.options.onOk} onCancel={m.options.onCancel} />
                </div>
              );
            }
            if (m.type === 'macroManager') {
              return (
                <div className="global-loading-container" key={m.id}>
                  <MacroManager id={m.id} onClose={close} onOk={m.options.onOk} onCancel={m.options.onCancel} />
                </div>
              );
            }

            return null;
          })}
        </div>,
        document.body
      )}
    </ModalContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('useModal must be used within ModalProvider');
  return ctx;
}
