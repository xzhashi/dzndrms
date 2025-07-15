
import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

export const HeartIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M6.32 2.577a4.95 4.95 0 0 1 7.36 0l.32.32.32-.32a4.95 4.95 0 0 1 7.36 0c2.03 2.03 2.03 5.32 0 7.36l-8 8a.75.75 0 0 1-1.06 0l-8-8a4.95 4.95 0 0 1 0-7.36Z" clipRule="evenodd" />
    </svg>
);
