import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

export const ShieldCheckIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2.03125L4.03125 4.96875C3.5 5.15625 3.125 5.625 3.125 6.1875V12C3.125 16.5938 6.46875 20.6562 10.9375 21.8438C11.5312 22 12.4688 22 13.0625 21.8438C17.5312 20.6562 20.875 16.5938 20.875 12V6.1875C20.875 5.625 20.5 5.15625 19.9688 4.96875L12 2.03125ZM15.4375 9.40625L11.4375 13.4062L9.5625 11.5312L8.5 12.5938L11.4375 15.5312L16.5 10.4688L15.4375 9.40625Z"></path>
    </svg>
);