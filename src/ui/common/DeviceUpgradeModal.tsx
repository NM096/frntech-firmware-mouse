import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface DeviceUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => Promise<void> | void;
  title?: string;
  description?: string;
  progress?: number; // 用于外部传入进度
}

export const DeviceUpgradeModal: React.FC<DeviceUpgradeModalProps> = ({
  isOpen,
  onClose,
  onUpgrade,
  title = '设备升级',
  description = '请确保设备连接稳定，点击下方按钮开始升级。',
  progress = 0,
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [currentProgress, setCurrentProgress] = useState(progress);
  const { t } = useTranslation();
  const [isUpgrading, setIsUpgrading] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (progress > currentProgress) {
      const interval = setInterval(() => {
        setCurrentProgress((prev) => {
          if (prev < progress) return prev + 5; // 每次增加5%的进度
          clearInterval(interval);
          return progress;
        });
      }, 100); // 每100ms更新一次
    }
  }, [progress, currentProgress]);
  const handleUpgrade = async () => {
    {
      try {
        setIsUpgrading(true);
        await onUpgrade();
        progress = 0;
      } catch (e) {
        console.error('Upgrade failed', e);
      } finally {
        setIsUpgrading(false);
      }
    }
  };
  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        ref={modalRef}
        style={styles.modal}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div style={styles.header}>
          <div style={styles.iconWrapper} className="modal-icon-anim">
            <i className="fas fa-sync-alt"></i>
          </div>
          <h2 style={styles.title}>{title}</h2>
        </div>

        <p style={styles.description}>{description}</p>

        {/* 进度条 */}
        <div style={styles.progressWrapper}>
          <div style={{ ...styles.progressBar, width: `${currentProgress}%` }} />
        </div>

        {!isUpgrading && (
          <div style={styles.actions}>
            <button style={{ ...styles.button, ...styles.upgradeButton }} onClick={async () => handleUpgrade()}>
              <i className="fas fa-arrow-up" style={{ marginRight: 8, animation: 'plug-bounce 800ms infinite' }} />
              {t('upgrade_device')}
            </button>
          </div>
        )}
      </div>

      {/* 动画样式（内联 <style>） */}
      <style>{`
        .modal-icon-anim i { font-size: 50px; }
        .modal-icon-anim { display:flex; align-items:center; justify-content:center; width:64px; height:64px; border-radius:999px; background: linear-gradient(135deg, rgba(0,0,0,0.06), rgba(0,0,0,0.02)); }
        @keyframes icon-rotate {
          0% { transform: rotate(0deg); }
          50% { transform: rotate(8deg) scale(1.1); }
          100% { transform: rotate(0deg); }
        }
        .modal-icon-anim i { animation: icon-rotate 2400ms ease-in-out infinite; }

        @keyframes plug-bounce {
          0% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
          100% { transform: translateY(0); }
        }

        .device-modal-backdrop {
          backdrop-filter: blur(8px) saturate(120%);
          -webkit-backdrop-filter: blur(8px) saturate(120%);
        }
      `}</style>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(10,10,10,0.35)',
    zIndex: 1000,
    backdropFilter: 'blur(8px) saturate(120%)',
    WebkitBackdropFilter: 'blur(8px) saturate(120%)',
  },
  modal: {
    minWidth: 360,
    maxWidth: '90vw',
    background: 'rgba(255,255,255,0.96)',
    borderRadius: 12,
    padding: '20px 22px',
    boxShadow: '0 10px 30px rgba(2,6,23,0.2)',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    alignItems: 'center',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  iconWrapper: {},
  title: { margin: 0, fontSize: 20, fontWeight: 700, color: '#d32f2f' }, // 红色标题
  description: { margin: 0, color: '#444', textAlign: 'center' },
  actions: { display: 'flex', gap: 10, marginTop: 6 },
  button: {
    padding: '8px 14px',
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  upgradeButton: {
    background: 'linear-gradient(90deg,#e53935,#d32f2f)', // 红色渐变
    color: '#fff',
  },
  cancelButton: {
    background: 'transparent',
    color: '#333',
    border: '1px solid rgba(0,0,0,0.08)',
  },
  progressWrapper: {
    width: '100%',
    height: 8,
    backgroundColor: '#ddd',
    borderRadius: 4,
    marginTop: 12,
    marginBottom: 12,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#e53935',
    borderRadius: '4px',
    transition: 'width 0.2s ease-in-out',
  },
};

export default DeviceUpgradeModal;
