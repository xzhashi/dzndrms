import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

export const PlaneIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.375a6.346 6.346 0 0 0 6.297-6.297 6.346 6.346 0 0 0-6.297-6.297A6.346 6.346 0 0 0 5.703 12.078a6.346 6.346 0 0 0 6.297 6.297Zm0-12.594a6.297 6.297 0 0 1 6.297 6.297 6.297 6.297 0 0 1-6.297 6.297A6.297 6.297 0 0 1 5.703 12.078a6.297 6.297 0 0 1 6.297-6.297Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.281 12.077h11.438" />
        <path strokeLinecap="round" strokeLinejoin="round" d="m9.422 17.531 1.968-5.453m3.282 0L16.64 6.625" />
    </svg>
);
