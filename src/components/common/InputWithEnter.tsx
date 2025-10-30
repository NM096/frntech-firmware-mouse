import React from 'react';

interface InputWithEnterProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onEnter?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

const InputWithEnter: React.FC<InputWithEnterProps> = ({ onEnter, ...restProps }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onEnter?.(e);
    }
    restProps.onKeyDown?.(e); // 保留原生 onKeyDown
  };

  return <input {...restProps} onKeyDown={handleKeyDown} />;
};

export default InputWithEnter;
