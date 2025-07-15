import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

export const BarnIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m16.5-18v18m-1.5-18l-15-6.75L2.25 6m19.5 0l-15-6.75L2.25 6m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-8.25 4.875a2.25 2.25 0 0 1-2.36 0l-8.25-4.875A2.25 2.25 0 0 1 2.25 6.243V6M15 15.75a3 3 0 0 1-6 0v-2.25a3 3 0 0 1 6 0v2.25Z" />
    </svg>
);
