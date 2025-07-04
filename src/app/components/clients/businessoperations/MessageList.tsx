import React, { useState } from 'react';
import { Send, Search } from 'lucide-react';
import Link from 'next/link';

interface MessageListProps {
  view?: 'full' | 'summary';
}

const recentMessages = [
  {
    id: 1,
    sender: 'Emily Brontë',
    avatar: 'EB',
    message: "The spacing between elements doesn't look right. What should I do?",
    time: '8 min',
    unread: true,
  },
  {
    id: 2,
    sender: 'Jane Austen',
    avatar: 'JA',
    message: 'hello, panzel can you help me with the shipment?',
    time: '8 min',
    unread: false,
  },
];

const mockContacts = [
  {
    id: 1,
    name: 'Jane Austen',
    avatar: 'JA',
    lastMessage: 'hello, panzel can you help me with the shipment?',
    time: '8min',
    unread: false,
    active: false,
  },
  {
    id: 2,
    name: 'J.K. Rowling',
    avatar: 'JK',
    lastMessage: 'hello, panzel can you help me with the shipment?',
    time: '8min',
    unread: false,
    active: false,
  },
  {
    id: 3,
    name: 'Emily Brontë',
    avatar: 'EB',
    lastMessage: 'hello, panzel can you help me with the shipment?',
    time: '8min',
    unread: false,
    active: true,
  },
  {
    id: 4,
    name: 'George Orwell',
    avatar: 'GO',
    lastMessage: 'hello, panzel can you help me with the shipment?',
    time: '8min',
    unread: false,
    active: false,
  },
  {
    id: 5,
    name: 'Fyodor Dostoevsky',
    avatar: 'FD',
    lastMessage: 'hello, panzel can you help me with the shipment?',
    time: '8min',
    unread: false,
    active: false,
  },
  {
    id: 6,
    name: 'Harper Lee',
    avatar: 'HL',
    lastMessage: 'hello, panzel can you help me with the shipment?',
    time: '8min',
    unread: false,
    active: false,
  },
  {
    id: 7,
    name: 'Charlotte Brontë',
    avatar: 'CB',
    lastMessage: 'hello, panzel can you help me with the shipment?',
    time: '8min',
    unread: false,
    active: false,
  },
  {
    id: 8,
    name: 'Herman Melville',
    avatar: 'HM',
    lastMessage: 'hello, panzel can you help me with the shipment?',
    time: '8min',
    unread: false,
    active: false,
  },
  {
    id: 9,
    name: 'Charles Dickens',
    avatar: 'CD',
    lastMessage: 'hello, panzel can you help me with the shipment?',
    time: '8min',
    unread: false,
    active: false,
  },
  {
    id: 10,
    name: 'Homer',
    avatar: 'H',
    lastMessage: 'hello, panzel can you help me with the shipment?',
    time: '8min',
    unread: false,
    active: false,
  },
];

const MessageList: React.FC<MessageListProps> = ({ view = 'summary' }) => {
  const [search, setSearch] = useState('');
  const filteredContacts = mockContacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  if (view === 'summary') {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Messages</h2>
          <Link href="/business/messages">
            <button className="bg-[#007bff] text-white hover:bg-blue-700 text-sm rounded-lg shadow-sm p-2 px-4">View All</button>
          </Link>
        </div>
        <div className="space-y-4">
          {recentMessages.map(message => (
            <div key={message.id} className={`p-3 rounded-lg ${message.unread ? 'bg-blue-50 border border-blue-100' : 'bg-white border border-gray-200'}`}> 
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
                  {message.avatar}
                </div>
                <div className="ml-2 flex-grow">
                  <h3 className="text-sm font-medium text-gray-900">{message.sender}</h3>
                  <p className="text-xs text-gray-500">{message.time}</p>
                </div>
                {message.unread && (
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                )}
              </div>
              <p className="text-xs text-gray-700">{message.message}</p>
              <div className="mt-2 flex justify-end">
                <button className="text-xs text-blue-600 hover:text-blue-800 flex items-center">
                  <Send className="h-3 w-3 mr-1" />
                  Reply
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Full view (split layout with gap)
  return (
    <div className="w-full flex flex-col md:flex-row gap-2 md:gap-4 h-[calc(100vh-100px)]">
      {/* Left: Message List */}
      <div className="w-full md:w-1/4 bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col mb-2 md:mb-0 h-full">
        <div className="p-4">
          <h2 className="text-xl font-semibold text-gray-900">Your Contacts</h2>
        </div>
        <div className="p-4 -mt-4">
          {/* Search Input */}
          <div className="relative ">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search name"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 py-2 rounded-lg border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        {/* Contacts List */}
        <div className="flex-1 p-4 -mt-4 overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold text-gray-900">Recent Messages</div>
            <button className="bg-[#007bff] text-white hover:bg-blue-700 text-xs rounded-lg shadow-sm px-4 py-2 ml-2">Add New</button>
          </div>
          <div className="space-y-1 overflow-y-auto scrollbar-hide h-full max-h-[calc(100vh-280px)]">
            {filteredContacts.map(contact => (
              <div
                key={contact.id}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                  contact.active ? 'bg-blue-50' : ''
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium text-sm">
                  {contact.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-gray-900 text-sm truncate">{contact.name}</span>
                    <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">{contact.time}</span>
                  </div>
                  <div className="text-xs text-gray-500 truncate mt-1">{contact.lastMessage}</div>
                </div>
                {contact.unread && <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Right: Chat Area */}
      <div className="w-full md:flex-1 bg-white rounded-lg shadow-sm border border-gray-100 flex items-center justify-center h-full">
        <span className="text-gray-400 text-lg">your message will appear here</span>
      </div>
    </div>
  );
};

export default MessageList;