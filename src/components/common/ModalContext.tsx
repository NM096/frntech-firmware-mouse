import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import GlobalLoading from './GlobalLoading';
import { useTranslation } from 'react-i18next';
import UpgradeLoading from './UpgradeLoading';
type LoadingOptions = {
  proccess?: number;
  onOk?: () => void;
};

type ConfirmOptions = {
  title: string;
  content: ReactNode;
  onOk?: (value?: string) => void;
  onCancel?: () => void;
};

type AlertOptions = {
  title: string;
  content: ReactNode;
  onOk?: () => void;
};

type ModalItem =
  | { type: 'loading'; id: string; options: LoadingOptions }
  | { type: 'upgradeLoading'; id: string; options: LoadingOptions }
  | { type: 'confirm'; id: string; options: ConfirmOptions }
  | { type: 'alert'; id: string; options: AlertOptions }
  | { type: 'custom'; id: string; content: ReactNode };

type ModalContextType = {
  openConfigLoading: (options: LoadingOptions) => string;
  openUpgradeLoading: (options: LoadingOptions) => string;
  openConfirm: (options: ConfirmOptions) => string;
  openAlert: (options: AlertOptions) => string;
  openCustom: (content: ReactNode) => string;
  close: (id: string) => void;
  closeAll: () => void;
};

const ModalContext = createContext<ModalContextType | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modals, setModals] = useState<ModalItem[]>([]);
  const [inputValue, setInputValue] = useState('');
  const { t } = useTranslation();
  const genId = () => Math.random().toString(36).slice(2);

  const openConfigLoading = (options: LoadingOptions) => {
    const id = genId();
    setModals((prev) => [...prev, { type: 'loading', id, options }]);
    return id;
  };
  const openUpgradeLoading = (options: LoadingOptions) => {
    const id = genId();
    setModals((prev) => [...prev, { type: 'upgradeLoading', id, options }]);
    return id;
  };
  const openConfirm = (options: ConfirmOptions) => {
    const id = genId();
    setModals((prev) => [...prev, { type: 'confirm', id, options }]);
    return id;
  };

  const openAlert = (options: AlertOptions) => {
    const id = genId();
    setModals((prev) => [...prev, { type: 'alert', id, options }]);
    return id;
  };

  const openCustom = (content: ReactNode) => {
    const id = genId();
    setModals((prev) => [...prev, { type: 'custom', id, content }]);
    return id;
  };

  const close = (id: string) => {
    setModals((prev) => {
      const modal = prev.find((m) => m.id === id);
      if (modal?.type === 'loading') {
        setTimeout(() => {
          setModals((current) => current.filter((m) => m.id !== id));
        }, 2000);
        return prev;
      }
      return prev.filter((m) => m.id !== id);
    });
  };

  const closeAll = () => setModals([]);

  return (
    <ModalContext.Provider
      value={{ openConfigLoading, openConfirm, openAlert, openCustom, close, closeAll, openUpgradeLoading }}
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
            if (m.type === 'upgradeLoading') {
              return (
                <div className="global-loading-container" key={m.id}>
                  <UpgradeLoading id={m.id} onClose={close} autoClose={false} />
                </div>
              );
            }
            if (m.type === 'confirm') {
              const { title, content, onOk, onCancel } = m.options;

              return (
                <div key={m.id} className="custom-confirm-container">
                  <div className="confirm-card">
                    <div className="confirm-title">{title}</div>
                    <div className="confirm-content">
                      <div>{content}</div>
                      <input
                        style={{ textAlign: 'center' }}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                      />
                    </div>

                    <div className="confirm-btn-group">
                      <div
                        className="confirm-btn"
                        onClick={() => {
                          onOk?.(inputValue);
                          setInputValue('');
                          close(m.id);
                        }}
                      >
                        {t('confirm')}
                      </div>
                      <div
                        className="confirm-btn"
                        onClick={() => {
                          onCancel?.();
                          setInputValue('');
                          close(m.id);
                        }}
                      >
                        {t('cancel')}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
            if (m.type === 'alert') {
              const { title, content, onOk } = m.options;
              return (
                <div key={m.id} className="custom-confirm-container">
                  <div className="confirm-card">
                    <div className="confirm-title">{title}</div>
                    <div className="confirm-content">
                      <div>{content}</div>
                    </div>

                    <div className="confirm-btn-group">
                      <div
                        className="confirm-btn"
                        onClick={() => {
                          onOk?.();
                          setInputValue('');
                          close(m.id);
                        }}
                      >
                        {t('confirm')}
                      </div>
                      <div
                        className="confirm-btn"
                        onClick={() => {
                          setInputValue('');
                          close(m.id);
                        }}
                      >
                        {t('cancel')}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
            if (m.type === 'custom') {
              return (
                <div key={m.id} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                  <div className="p-6 bg-white shadow-xl rounded-2xl">
                    {m.content}
                    <button className="px-4 py-2 mt-4 bg-gray-200 rounded" onClick={() => close(m.id)}>
                      {t('close')}
                    </button>
                  </div>
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
