
import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

export const TagIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M3.5 2C2.67157 2 2 2.67157 2 3.5V10.5356C2 10.9577 2.16912 11.3631 2.46445 11.6585L13.4897 22.6837C14.2707 23.4648 15.5371 23.4648 16.318 22.6837L22.682 16.3197C23.4631 15.5387 23.4631 14.2723 22.682 13.4913L11.6567 2.46597C11.3613 2.17064 10.956 2 10.5338 2H3.5ZM7 7C6.44772 7 6 6.55228 6 6C6 5.44772 6.44772 5 7 5C7.55228 5 8 5.44772 8 6C8 6.55228 7.55228 7 7 7Z"></path>
  </svg>
);
