import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

export const GridViewIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M2 2H10V10H2V2ZM4 4V8H8V4H4ZM2 14H10V22H2V14ZM4 16V20H8V16H4ZM14 2H22V10H14V2ZM16 4V8H20V4H16ZM14 14H22V22H14V14ZM16 16V20H20V16H16Z"></path>
  </svg>
);