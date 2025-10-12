import { useState } from 'react';

interface HoverImageProps {
  src: string; // 默认图片
  hoverSrc: string; // Hover 图片
  alt?: string; // 图片描述
  className?: string; // Tailwind 类
  title?: string; // 鼠标悬停提示
  onClick?: () => void; // 点击事件
}

export default function HoverImage({ src, hoverSrc, alt, className, title, onClick }: HoverImageProps) {
  const [isHover, setIsHover] = useState(false);

  return (
    <img
      src={isHover ? hoverSrc : src}
      alt={alt || 'icon'}
      title={title || ''}
      className={`transition duration-300 ${className || ''}`}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={onClick}
    />
  );
}
