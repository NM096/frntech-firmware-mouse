interface GameConfigurationProps {
  id: string;
  onClose: (id: string) => void;
  onOk?: () => void;
  onCancel?: () => void;
}
export default function GameConfiguration({ id, onClose, onOk, onCancel }: GameConfigurationProps) {
  return (
    <div className="game-configuration-container">
      <div className="action-item" onClick={() => onOk?.()}></div>
      <div
        className="action-item"
        onClick={() => {
          onCancel?.();
          onClose(id);
        }}
      ></div>
      <input className="game-name-input" id="fileName" />
      <input className="game-patch-input" id="filePatch" />
      <div className="start-program-explain"></div>
    </div>
  );
}
