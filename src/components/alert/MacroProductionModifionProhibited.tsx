interface MacroProductionModifionProhibitedProps {
  id: string;
  onClose: (id: string) => void;
  onOk?: () => void;
  onCancel?: () => void;
}
const MacroProductionModifionProhibited: React.FC<MacroProductionModifionProhibitedProps> = ({
  id,
  onClose,
  onCancel,
  onOk,
}) => {
  return (
    <div key={id} className="macro-production-modifion-prohibited-warn-container">
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

export default MacroProductionModifionProhibited;
