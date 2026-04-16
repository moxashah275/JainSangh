// Initial Data
export const INITIAL_TRUSTS = [
  { id: 1, name: 'Shree Palitana Jain Trust', code: 'TR001', city: 'Palitana', admin: 'Rajesh Mehta', phone: '+91 98765 43210', address: 'Main Road, Near Derasar, Palitana', status: true },
  { id: 2, name: 'Ahmedabad Jain Trust', code: 'TR002', city: 'Ahmedabad', admin: 'Nitin Shah', phone: '+91 98765 43211', address: 'SG Highway, Ahmedabad', status: true },
  { id: 3, name: 'Surat Jain Mandir Trust', code: 'TR003', city: 'Surat', admin: 'Mukesh Patel', phone: '+91 98765 43212', address: 'City Light Road, Surat', status: false },
  { id: 4, name: 'Rajkot Jain Sangh Trust', code: 'TR004', city: 'Rajkot', admin: 'Dinesh Boda', phone: '+91 98765 43213', address: 'Jain Derasar, Rajkot', status: true },
];

export const INITIAL_SANGHS = [
  { id: 101, name: 'Ahmedabad Jain Sangh', city: 'Ahmedabad', members: 1250, address: 'Near Jain Temple, Ahmedabad', type: 'Main', sanghHead: 'Ramesh Shah', headContact: '+91 98765 43214', status: true },
  { id: 102, name: 'Surat Jain Sangh', city: 'Surat', members: 850, address: 'City Light, Surat', type: 'Main', sanghHead: 'Kiran Patel', headContact: '+91 98765 43215', status: true },
  { id: 103, name: 'Palitana Sangh', city: 'Palitana', members: 450, address: 'Taleti Road, Palitana', type: 'Regional', sanghHead: 'Vijay Mehta', headContact: '+91 98765 43216', status: false },
  { id: 104, name: 'Rajkot Jain Sangh', city: 'Rajkot', members: 620, address: 'Kalavad Road, Rajkot', type: 'Main', sanghHead: 'Ashok Boda', headContact: '+91 98765 43217', status: true },
  { id: 105, name: 'Vadodara Jain Sangh', city: 'Vadodara', members: 780, address: 'Alkapuri, Vadodara', type: 'Main', sanghHead: 'Mahesh Jain', headContact: '+91 98765 43218', status: true },
];

export const INITIAL_LINKS = [
  { id: 1, trustId: 1, sanghId: 101, status: true },
  { id: 2, trustId: 1, sanghId: 103, status: true },
  { id: 3, trustId: 2, sanghId: 101, status: true },
  { id: 4, trustId: 3, sanghId: 102, status: true },
  { id: 5, trustId: 4, sanghId: 104, status: true },
];

// Add this export - INITIAL_DEPARTMENTS
export const INITIAL_DEPARTMENTS = [
  { id: 1, name: 'Accounts & Finance', head: 'Nirav Shah', members: 5 },
  { id: 2, name: 'Donation Management', head: 'Mehul Mehta', members: 8 },
  { id: 3, name: 'Event Management', head: 'Rakesh Jain', members: 12 },
];

const STORAGE_KEY = 'org_management_final_v2';

export const getOrgData = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return JSON.parse(saved);
  return { trusts: INITIAL_TRUSTS, sanghs: INITIAL_SANGHS, links: INITIAL_LINKS };
};

export const saveOrgData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const getTrustName = (trustId, trusts) => {
  const trust = trusts.find(t => t.id === trustId);
  return trust ? trust.name : 'Unknown Trust';
};

export const getSanghName = (sanghId, sanghs) => {
  const sangh = sanghs.find(s => s.id === sanghId);
  return sangh ? sangh.name : 'Unknown Sangh';
};