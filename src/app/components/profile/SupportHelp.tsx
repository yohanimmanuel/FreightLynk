import React from 'react';
import { Mail, HelpCircle } from 'lucide-react';

const SupportHelp: React.FC = () => {
  return (
    <div className="w-full flex flex-col gap-6">
      <div className="mb-2">
        <h2 className="text-md font-semibold text-gray-900 mb-2 flex items-center gap-2">
          Support & Help
        </h2>
        <p className="text-gray-500 text-xs mb-4">Have a question or need help? Reach out to our support team and we’ll get back to you as soon as possible.</p>
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-lg px-4 py-3">
          <Mail className="w-4 h-4 text-blue-500" />
          <span className="text-xs text-gray-700 font-medium select-all">yohanimmanuelhendrajaya@gmail.com</span>
        </div>
      </div>
    </div>
  );
};

export default SupportHelp;
