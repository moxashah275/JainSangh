// 1. Define Constants here so they can be exported directly for other components (like UserList)
export const INITIAL_TRUSTS = [
  { id: 1, name: 'Sheth Anandji Kalyanji Trust', code: 'SAKT01', admin: 'Rajesh Shah', phone: '9876500000', address: 'Main Road, Palitana', city: 'Palitana', status: true },
  { id: 2, name: 'Shree Palitana Jain Vitrag Trust', code: 'SPJVT', admin: 'Mahendra Mehta', phone: '9876500001', address: 'Taleti Area', city: 'Palitana', status: true }
];

export const INITIAL_SANGHS = [
  { id: 101, name: 'Sathandji Kalyanji Sangh', city: 'Palitana', members: 1200, address: 'Near Derasar', type: 'Main', status: true },
  { id: 102, name: 'Taleti Road Sangh', city: 'Palitana', members: 450, address: 'Taleti', type: 'Regional', status: true }
];

const INITIAL_LINKS = [
  { id: 1, trustId: 1, sanghId: 101, status: true },
  { id: 2, trustId: 1, sanghId: 102, status: true }
];

export const INITIAL_DEPARTMENTS = [
  { id: 201, name: 'Accounts & Finance', head: 'Nirav Shah', members: 5, status: true },
  { id: 202, name: 'Donation Management', head: 'Mehul Mehta', members: 8, status: true },
];

// 2. Local Storage Helpers
const STORAGE_KEY = 'org_management_v2';

const generateInitialData = () => ({
  trusts: INITIAL_TRUSTS,
  sanghs: INITIAL_SANGHS,
  links: INITIAL_LINKS
});

export const getOrgData = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return JSON.parse(saved);
  return generateInitialData();
};

export const saveOrgData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// 3. Getter Helpers
export const getTrustName = (trustId, trusts) => {
  const trust = trusts.find(t => t.id === Number(trustId));
  return trust ? trust.name : 'Unknown Trust';
};

export const getSanghName = (sanghId, sanghs) => {
  const sangh = sanghs.find(s => s.id === Number(sanghId));
  return sangh ? sangh.name : 'Unknown Sangh';
};