import CustomRadio from '../common/CustomRadio';

interface MacroManagerProps {
  id: string;
  onClose: (id: string) => void;
  onOk?: () => void;
  onCancel?: () => void;
}
export default function MacroManager({ id, onClose, onOk, onCancel }: MacroManagerProps) {
  return (
    <div className="macro-manager-container" key={id}>
      <div>
        <div className="macro-header-bg"></div>
        <div className="macro-header-line"></div>
      </div>
      <div className="macro-title">Macro Manager</div>
      <div className="macro-content-container">
        <div className="macro-content-left">
          <div className="flex">
            <div className="macros-list">
              <div>Macros List</div>
              <div className="list-items"></div>
            </div>
            <div className="keys-list">
              <div>Keys List</div>
              <div className="list-items"></div>
            </div>
          </div>
          <div className="macro-radio-item">
            <CustomRadio customSize="small" />
            <div>Repeat Specified Number or Any Key to End</div>
          </div>
          <div className="macro-radio-item">
            <CustomRadio customSize="small" />
            <div>Repeatedly Specify Any Key to End</div>
          </div>
          <div className="macro-radio-item">
            <CustomRadio customSize="small" />
            <div>Repeatedly Specify Buttons loosen the End</div>
          </div>
        </div>

        <div className="macro-content-right">
          <div className="macro-right-title">Record Option</div>

          <div>
            <div className="right-record-button">Record</div>
            <div className="flex">
              <CustomRadio customSize="small" />
              <div>Delay Between the Record Button</div>
            </div>
            <div className="cycle-index">
              <div> Cycle Index</div>
              <input className="cycle-index-input" />
            </div>
          </div>
        </div>
        <div className="macro-button-list"></div>
      </div>
    </div>
  );
}
