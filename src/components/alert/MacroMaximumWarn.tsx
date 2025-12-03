interface MacroMaximumWarnProps {
  id: string;
  onClose: (id: string) => void;
  onOk?: () => void;
  onCancel?: () => void;
}
const MacroMaximumWarn: React.FC<MacroMaximumWarnProps> = ({ id, onClose, onCancel, onOk }) => {
  return (
    <div key={id} className="macro-maximum-warn-container">
      <div className="action-item" onClick={() => onOk?.()}></div>

      <div
        className="action-item"
        onClick={() => {
          onClose(id);
          onCancel?.();
        }}
      ></div>
    </div>
  );
};

export default MacroMaximumWarn;
