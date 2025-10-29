
import React from 'react';

const MicrophoneIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    {...props}
  >
    <path d="M12 1.75a3.25 3.25 0 00-3.25 3.25v6a3.25 3.25 0 006.5 0v-6A3.25 3.25 0 0012 1.75z" />
    <path d="M18.25 11a.75.75 0 00-1.5 0v.25A4.75 4.75 0 0112 16a4.75 4.75 0 01-4.75-4.75V11a.75.75 0 00-1.5 0v.25a6.25 6.25 0 005.5 6.22v2.28h-2.25a.75.75 0 000 1.5h5a.75.75 0 000-1.5H12.75v-2.28a6.25 6.25 0 005.5-6.22V11z" />
  </svg>
);

export default MicrophoneIcon;
