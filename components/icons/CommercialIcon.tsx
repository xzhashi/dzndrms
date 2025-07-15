import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

export const CommercialIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18m-1.5-18l-10.5 6.364M7.5 21V11.25m6-6.364V11.25m6-6.364V11.25m0 9.75V11.25M15 11.25V21m-7.5-9.75V21m-4.5-6.75h16.5" />
    </svg>
);