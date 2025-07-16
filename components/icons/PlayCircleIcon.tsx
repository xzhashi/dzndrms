
import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

export const PlayCircleIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm14.024-.983a1.125 1.125 0 0 1 0 1.966l-5.625 3.125a1.125 1.125 0 0 1-1.65-.883V8.783c0-.882.97-1.428 1.65-.883l5.625 3.125Z" clipRule="evenodd" />
    </svg>
);
