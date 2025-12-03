interface ResetWarnProps {
  id: string;
  onClose: (id: string) => void;
  onOk?: () => void;
  onCancel?: () => void;
}
const ResetWarn: React.FC<ResetWarnProps> = ({ id, onClose, onCancel, onOk }) => {
  return (
    <div key={id} className="reset-warn-container">
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

export default ResetWarn;
