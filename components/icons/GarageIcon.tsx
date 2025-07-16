
import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

export const GarageIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 9.75 16.5 0M4.5 6.75 12 3m0 0 7.5 3.75M12 3v2.25M18.75 9.75l-6.75 6.75-6.75-6.75M18.75 9.75v10.5A2.25 2.25 0 0 1 16.5 22.5h-9A2.25 2.25 0 0 1 5.25 20.25V9.75" />
    </svg>
);
