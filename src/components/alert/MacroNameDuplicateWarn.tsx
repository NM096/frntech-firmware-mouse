interface MacroNameDuplicateWarnProps {
  id: string;
  onClose: (id: string) => void;
  onOk?: () => void;
  onCancel?: () => void;
}
const MacroNameDuplicateWarn: React.FC<MacroNameDuplicateWarnProps> = ({ id, onClose, onCancel, onOk }) => {
  return (
    <div key={id} className="macro-name-duplicate-warn-container">
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

export default MacroNameDuplicateWarn;
