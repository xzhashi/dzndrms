
import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

export const HomeIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2.09961L1 12H4V21H11V15H13V21H20V12H23L12 2.09961ZM12 4.79102L18 10.1914V19H15V13H9V19H6V10.1914L12 4.79102Z"></path>
  </svg>
);
