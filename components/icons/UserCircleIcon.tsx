
import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

export const UserCircleIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM9 10.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm-2.003 6.25a7.5 7.5 0 0 1 10.006 0A9.723 9.723 0 0 1 12 21.75a9.723 9.723 0 0 1-5.003-2.5Z" clipRule="evenodd" />
  </svg>
);
