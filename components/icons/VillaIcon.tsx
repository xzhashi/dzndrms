import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

export const VillaIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3.545l-4.5 1.636m0 0L2.25 9l4.5 1.636M18.75 3.545l-4.5 1.636m-4.5-1.636L9 3.545m0 0l4.5 1.636m0 0l4.5-1.636" />
    </svg>
);