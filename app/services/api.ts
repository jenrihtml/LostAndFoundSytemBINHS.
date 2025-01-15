const STORAGE_KEY = 'lost_and_found_system_data';

interface User {
  id: string;
  fullName: string;
  email: string;
  gradeLevel: string;
  section: string;
  strand: string;
  building: string;
  profilePicture: string;
  role: 'user' | 'admin';
}

interface Item {
  id: string;
  name: string;
  description: string;
  category: string;
  ownerId: string;
  codeType: 'barcode' | 'qrcode';
  code: string;
  history: FoundReport[];
}

interface FoundReport {
  id: string;
  itemId: string;
  foundBy: string;
  foundAt: string;
}

interface AppData {
  users: User[];
  items: Item[];
  foundReports: FoundReport[];
}

const initialData: AppData = {
  users: [],
  items: [],
  foundReports: [],
};

function loadData(): AppData {
  const storedData = localStorage.getItem(STORAGE_KEY);
  return storedData ? JSON.parse(storedData) : initialData;
}

function saveData(data: AppData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function generateShortCode(): string {
  return Math.random().toString(36).substr(2, 6).toUpperCase();
}

export const api = {
  registerUser: (user: Omit<User, 'id' | 'role'>): User => {
    const data = loadData();
    const newUser = { ...user, id: Date.now().toString(), role: 'user' };
    data.users.push(newUser);
    saveData(data);
    return newUser;
  },

  registerItem: (item: Omit<Item, 'id' | 'code' | 'history'>): Item => {
    const data = loadData();
    const newItem = { 
      ...item, 
      id: Date.now().toString(),
      code: generateShortCode(),
      history: []
    };
    data.items.push(newItem);
    saveData(data);
    return newItem;
  },

  reportFoundItem: (report: Omit<FoundReport, 'id'>): FoundReport => {
    const data = loadData();
    const newReport = { ...report, id: Date.now().toString() };
    data.foundReports.push(newReport);
    const item = data.items.find(i => i.id === report.itemId);
    if (item) {
      item.history.push(newReport);
    }
    saveData(data);
    return newReport;
  },

  getItemByCode: (code: string): Item | undefined => {
    const data = loadData();
    return data.items.find(item => item.code === code);
  },

  getUserById: (userId: string): User | undefined => {
    const data = loadData();
    return data.users.find(user => user.id === userId);
  },

  getUsers: (): User[] => {
    const data = loadData();
    return data.users;
  },

  getItems: (): Item[] => {
    const data = loadData();
    return data.items;
  },

  getFoundReports: (): FoundReport[] => {
    const data = loadData();
    return data.foundReports;
  },

  login: (email: string, password: string): User | null => {
    // This is a mock login. In a real app, you'd hash the password and compare it securely.
    const data = loadData();
    const user = data.users.find(u => u.email === email);
    return user || null;
  },

  sendNotification: (userId: string, message: string): void => {
    // This is a mock notification. In a real app, you'd integrate with a notification service.
    console.log(`Notification sent to user ${userId}: ${message}`);
  }
};

