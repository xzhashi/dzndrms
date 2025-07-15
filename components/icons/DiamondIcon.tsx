import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

export const DiamondIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12.0001 1.60669L22.3935 6.80312L12.0001 22.3935L1.60669 6.80312L12.0001 1.60669ZM12.0001 4.63384L5.41443 8.30312L12.0001 18.3663L18.5859 8.30312L12.0001 4.63384Z"></path>
    </svg>
);
