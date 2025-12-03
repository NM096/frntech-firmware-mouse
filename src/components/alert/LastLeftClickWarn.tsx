interface LastLeftClickWarnProps {
  id: string;
  onClose: (id: string) => void;
  onOk?: () => void;
  onCancel?: () => void;
}
export default function LastLeftClickWarn({ id, onClose, onOk, onCancel }: LastLeftClickWarnProps) {
  return (
    <div key={id} className="last-left-click-warn-container">
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
}
