import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

export const CalendarIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M5.75 3a.75.75 0 0 0-.75.75v.5h13.5v-.5a.75.75 0 0 0-.75-.75h-12ZM4.5 6.75A.75.75 0 0 1 5.25 6h13.5a.75.75 0 0 1 .75.75v11.5a.75.75 0 0 1-.75.75H5.25a.75.75 0 0 1-.75-.75v-11.5ZM7.5 10a.75.75 0 0 0-1.5 0v.01a.75.75 0 0 0 1.5 0V10Zm3.75 1.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-1.5-1.5a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm-1.5 3a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm1.5 1.5a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm1.5-1.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm1.5 1.5a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm2.25-3a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-1.5-1.5a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" clipRule="evenodd" />
  </svg>
);