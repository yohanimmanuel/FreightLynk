export interface Message {
    id: number;
    sender: string;
    avatar: string;
    message: string;
    time: string;
    unread: boolean;
  }

export const recentMessages = [
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


export interface Contact {
    id: number;
    name: string;
    avatar: string;
    lastMessage: string;
    time: string;
    unread: boolean;
    active: boolean;
  }
  
export const mockContacts = [
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