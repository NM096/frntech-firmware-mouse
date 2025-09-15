import CustomRadio from '@/components/common/CustomRadio';
import { useTranslation } from 'react-i18next';
import type { KeyItem } from '@/types/profile';
import type { KeyDefine } from '@/types/profile';

interface MouseProp {
  list: KeyItem[];
  onChange: (value: KeyItem) => void;
  keyDefine: KeyDefine | undefined;
}
const Mouse: React.FC<MouseProp> = ({ list, onChange, keyDefine }) => {
  const { t } = useTranslation();
  return (
    <>
      {list.map((item) => (
        <div
          key={item.Value}
          style={{
            display: 'flex',
            alignItems: 'center',
            margin: '0 20px 10px',
            justifyContent: 'space-between',
            width: 'calc(100% - 40px)',
            cursor: 'pointer',
            fontSize: '12px',
          }}
          onClick={() => onChange(item)}
        >
          <span>{t(item.Lang)}</span>
          <CustomRadio checked={keyDefine?.Value === item.Value} customSize={'small'} />
        </div>
      ))}
    </>
  );
};
export default Mouse;
