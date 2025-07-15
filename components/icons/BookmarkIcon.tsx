import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

export const BookmarkIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M5 2H19C19.5523 2 20 2.44772 20 3V22.1433C20 22.4194 19.7761 22.6434 19.5 22.6434C19.4061 22.6434 19.314 22.6154 19.2344 22.5602L12 18.0313L4.76559 22.5602C4.49333 22.7136 4.14299 22.6418 3.96231 22.3828C3.84306 22.2198 3.86803 21.9961 4 21.8567V3C4 2.44772 4.44772 2 5 2ZM18 4H6V19.4398L12 15.6987L18 19.4398V4Z"></path>
    </svg>
);
