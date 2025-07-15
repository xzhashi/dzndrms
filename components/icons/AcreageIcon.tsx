import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

export const AcreageIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M21 21H3V3H21V21ZM19 5H5V19H19V5ZM17 7V17H7V7H17Z"></path>
    </svg>
);
