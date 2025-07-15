import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

export const BathIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M4 3H2V22H22V3H20V12H4V3ZM6 5V10H18V5H6ZM17.5 13C16.9477 13 16.5 13.4477 16.5 14C16.5 15.2443 15.2284 16.0333 14.526 16.2999C13.2558 16.7916 12.5 17.25 12.5 18H17.5C18.3284 18 19 17.3284 19 16.5V14C19 13.4477 18.5523 13 18 13H17.5Z"></path>
    </svg>
);
