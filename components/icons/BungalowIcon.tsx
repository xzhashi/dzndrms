import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

export const BungalowIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21L21 21M3.282 4.002L21 4M18.75 12H5.25m13.5 0V21m-13.5 0V12m0 0V4.002m13.5 0V12m0 0h-4.5m4.5 0h-4.5m4.5 0V4.002m-13.5 0h4.5m-4.5 0h4.5m-4.5 0V12m0 0h4.5" />
    </svg>
);