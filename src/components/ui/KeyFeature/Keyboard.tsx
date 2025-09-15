import Checkbox from '@/components/common/Checkbox';

const Keyboard = () => {
  const keys = [
    { name: 'Ctrl', code: 'Control' },
    { name: 'Shift', code: 'Shift' },
    { name: 'Alt', code: 'Alt' },
    { name: 'Win', code: 'Meta' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '10px' }}>
      <input
        type="text"
        style={{ backgroundColor: 'white', border: 'none', outline: 'none', color: 'black', width: '80%' }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', marginLeft: '20px' }}>
        {keys.map((key) => (
          <div key={key.code}>
            <Checkbox size={16} color="var(--secondary)" onChange={() => {}} />
            <label style={{ marginLeft: '5px' }}>{key.name}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Keyboard;
