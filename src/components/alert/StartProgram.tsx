interface StartProgramProps {
  id: string;
  onClose: (id: string) => void;
  onOk?: () => void;
  onCancel?: () => void;
}
export default function StartProgram({ id, onClose, onOk, onCancel }: StartProgramProps) {
  return (
    <div className="start-program-container">
      <div className="start-program-explain"></div>
      <input className="start-program-input"></input>
      <div className="action-confirm-container">
        <div className="action-item" onClick={() => onOk?.()}></div>
        <div className="action-item" onClick={() => onCancel?.()}></div>
      </div>
    </div>
  );
}
