function createDocument(title, name, uploadDate) {
  return {
    title,
    name,
    size: '2.4 MB',
    uploadDate,
  };
}

function createTrustMember(id, name, designation, mobile, email, area, city, status = true) {
  return { id, name, designation, mobile, email, area, city, status };
}

function createCommitteeMember(id, name, designation, mobile, email, area, city, status = true) {
  return { id, name, designation, mobile, email, area, city, status };
}

export function createTrustDraft() {
  return {
    name: 'Shree Vardhman Jain Trust',
    mainContactPerson: 'Prakash Shah',
    mobile: '+91 98765 12000',
    email: 'prakash@vardhmantrust.org',
    address: 'Temple View Road, Main Market',
    area: 'Central Zone',
    city: 'Ahmedabad',
    state: 'Gujarat',
    about: 'Community trust focused on seva, education, and temple administration.',
    totalMembers: 950,
    team: [
      createTrustMember(1, 'Prakash Shah', 'President', '+91 98765 12000', 'prakash@vardhmantrust.org', 'Central Zone', 'Ahmedabad', true),
      createTrustMember(2, 'Minal Doshi', 'Secretary', '+91 98765 12001', 'minal@vardhmantrust.org', 'Satellite', 'Ahmedabad', true),
    ],
    document: createDocument('Trust Registration Certificate', 'vardhman-trust-certificate.pdf', '2024-03-04T10:00:00Z'),
    linkedSanghs: [101],
    status: true,
  };
}

export function createSanghDraft() {
  return {
    name: 'Shree Mahavir Jain Sangh',
    mainPersonName: 'Jignesh Mehta',
    mobile: '+91 98765 13000',
    email: 'jignesh@mahavirsangh.org',
    address: 'Derasar Street, Jain Chowk',
    area: 'Navrangpura',
    city: 'Ahmedabad',
    state: 'Gujarat',
    totalFamilies: 240,
    totalMembers: 860,
    about: 'Regional sangh coordinating events, members, youth activities, and social outreach.',
    committee: [
      createCommitteeMember(1, 'Jignesh Mehta', 'President', '+91 98765 13000', 'jignesh@mahavirsangh.org', 'Navrangpura', 'Ahmedabad', true),
      createCommitteeMember(2, 'Heena Shah', 'Secretary', '+91 98765 13001', 'heena@mahavirsangh.org', 'Paldi', 'Ahmedabad', true),
    ],
    document: createDocument('Sangh Registration Certificate', 'mahavir-sangh-certificate.pdf', '2024-03-12T10:00:00Z'),
    linkedTrustId: 2,
    status: true,
  };
}

// Initial Data - Clean frontend only
export const INITIAL_TRUSTS = [
  {
    id: 1,
    name: 'Shree Palitana Jain Trust',
    mainContactPerson: 'Rajesh Mehta',
    mobile: '+91 98765 43210',
    email: 'rajesh@palitanatrust.org',
    address: 'Main Road, Near Derasar',
    area: 'Taleti',
    city: 'Palitana',
    state: 'Gujarat',
    about: 'Managing Palitana Jain temple and community services with focus on education and healthcare.',
    totalMembers: 1250,
    team: [
      createTrustMember(11, 'Rajesh Mehta', 'President', '+91 98765 43210', 'rajesh@palitanatrust.org', 'Taleti', 'Palitana', true),
      createTrustMember(12, 'Asha Mehta', 'Trustee', '+91 98765 43219', 'asha@palitanatrust.org', 'Main Road', 'Palitana', true),
    ],
    document: createDocument('Palitana Trust Certificate', 'palitana-trust-certificate.pdf', '2024-01-05T10:00:00Z'),
    linkedSanghs: [101, 103],
    status: true,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
    activity: [{ id: 1, action: 'Trust Created', timestamp: '2024-01-01T10:00:00Z', user: 'Admin' }]
  },
  {
    id: 2,
    name: 'Ahmedabad Jain Trust',
    mainContactPerson: 'Nitin Shah',
    mobile: '+91 98765 43211',
    email: 'nitin@ahmedabadtrust.org',
    address: 'SG Highway, Bodakdev',
    area: 'Bodakdev',
    city: 'Ahmedabad',
    state: 'Gujarat',
    about: 'Ahmedabad Jain community services, managing multiple temples and social activities.',
    totalMembers: 2100,
    team: [
      createTrustMember(21, 'Nitin Shah', 'Chairman', '+91 98765 43211', 'nitin@ahmedabadtrust.org', 'Bodakdev', 'Ahmedabad', true),
      createTrustMember(22, 'Bhavna Jain', 'Manager', '+91 98765 43220', 'bhavna@ahmedabadtrust.org', 'Satellite', 'Ahmedabad', true),
    ],
    document: createDocument('Ahmedabad Trust Deed', 'ahmedabad-trust-deed.pdf', '2024-01-08T10:00:00Z'),
    linkedSanghs: [101],
    status: true,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
    activity: [{ id: 1, action: 'Trust Created', timestamp: '2024-01-01T10:00:00Z', user: 'Admin' }]
  },
  {
    id: 3,
    name: 'Surat Jain Mandir Trust',
    mainContactPerson: 'Mukesh Patel',
    mobile: '+91 98765 43212',
    email: 'mukesh@surattrust.org',
    address: 'City Light Road, Adajan',
    area: 'Adajan',
    city: 'Surat',
    state: 'Gujarat',
    about: 'Managing Surat Jain temple and community events.',
    totalMembers: 850,
    team: [
      createTrustMember(31, 'Mukesh Patel', 'President', '+91 98765 43212', 'mukesh@surattrust.org', 'Adajan', 'Surat', false),
      createTrustMember(32, 'Kokila Shah', 'Accountant', '+91 98765 43221', 'kokila@surattrust.org', 'City Light', 'Surat', true),
    ],
    document: createDocument('Surat Mandir Trust File', 'surat-mandir-trust.pdf', '2024-01-11T10:00:00Z'),
    linkedSanghs: [102],
    status: false,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
    activity: [{ id: 1, action: 'Trust Created', timestamp: '2024-01-01T10:00:00Z', user: 'Admin' }]
  },
  {
    id: 4,
    name: 'Rajkot Jain Sangh Trust',
    mainContactPerson: 'Dinesh Boda',
    mobile: '+91 98765 43213',
    email: 'dinesh@rajkottrust.org',
    address: 'Jain Derasar, Kalavad Road',
    area: 'Kalavad Road',
    city: 'Rajkot',
    state: 'Gujarat',
    about: 'Rajkot region Jain activities and community welfare programs.',
    totalMembers: 980,
    team: [
      createTrustMember(41, 'Dinesh Boda', 'President', '+91 98765 43213', 'dinesh@rajkottrust.org', 'Kalavad Road', 'Rajkot', true),
      createTrustMember(42, 'Pooja Boda', 'Secretary', '+91 98765 43222', 'pooja@rajkottrust.org', 'University Road', 'Rajkot', true),
    ],
    document: createDocument('Rajkot Trust Registration', 'rajkot-trust-registration.pdf', '2024-01-14T10:00:00Z'),
    linkedSanghs: [104],
    status: true,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
    activity: [{ id: 1, action: 'Trust Created', timestamp: '2024-01-01T10:00:00Z', user: 'Admin' }]
  }
];

export const INITIAL_SANGHS = [
  {
    id: 101,
    name: 'Ahmedabad Jain Sangh',
    mainPersonName: 'Ramesh Shah',
    mobile: '+91 98765 43214',
    email: 'ramesh@ahmedabadsangh.org',
    address: 'Near Jain Temple, Ellisbridge',
    area: 'Navrangpura',
    city: 'Ahmedabad',
    state: 'Gujarat',
    totalFamilies: 350,
    totalMembers: 1250,
    about: 'Main sangh for Ahmedabad region, active in community service and religious activities.',
    committee: [
      createCommitteeMember(1011, 'Ramesh Shah', 'President', '+91 98765 43214', 'ramesh@ahmedabadsangh.org', 'Navrangpura', 'Ahmedabad', true),
      createCommitteeMember(1012, 'Parul Doshi', 'Committee Member', '+91 98765 43223', 'parul@ahmedabadsangh.org', 'Ellisbridge', 'Ahmedabad', true),
    ],
    document: createDocument('Ahmedabad Sangh Document', 'ahmedabad-sangh-document.pdf', '2024-02-01T10:00:00Z'),
    linkedTrustId: 2,
    status: true,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
    activity: [{ id: 1, action: 'Sangh Created', timestamp: '2024-01-01T10:00:00Z', user: 'Admin' }]
  },
  {
    id: 102,
    name: 'Surat Jain Sangh',
    mainPersonName: 'Kiran Patel',
    mobile: '+91 98765 43215',
    email: 'kiran@suratsangh.org',
    address: 'City Light Road',
    area: 'City Light',
    city: 'Surat',
    state: 'Gujarat',
    totalFamilies: 250,
    totalMembers: 850,
    about: 'Surat region Jain activities and community engagement.',
    committee: [
      createCommitteeMember(1021, 'Kiran Patel', 'President', '+91 98765 43215', 'kiran@suratsangh.org', 'City Light', 'Surat', true),
      createCommitteeMember(1022, 'Nirali Shah', 'Secretary', '+91 98765 43224', 'nirali@suratsangh.org', 'Adajan', 'Surat', true),
    ],
    document: createDocument('Surat Sangh Profile', 'surat-sangh-profile.pdf', '2024-02-04T10:00:00Z'),
    linkedTrustId: 3,
    status: true,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
    activity: [{ id: 1, action: 'Sangh Created', timestamp: '2024-01-01T10:00:00Z', user: 'Admin' }]
  },
  {
    id: 103,
    name: 'Palitana Sangh',
    mainPersonName: 'Vijay Mehta',
    mobile: '+91 98765 43216',
    email: 'vijay@palitanasangh.org',
    address: 'Taleti Road',
    area: 'Taleti',
    city: 'Palitana',
    state: 'Gujarat',
    totalFamilies: 120,
    totalMembers: 450,
    about: 'Palitana region sangh, focused on pilgrimage services.',
    committee: [
      createCommitteeMember(1031, 'Vijay Mehta', 'President', '+91 98765 43216', 'vijay@palitanasangh.org', 'Taleti', 'Palitana', false),
      createCommitteeMember(1032, 'Neha Shah', 'Manager', '+91 98765 43225', 'neha@palitanasangh.org', 'Temple Road', 'Palitana', true),
    ],
    document: createDocument('Palitana Sangh Registration', 'palitana-sangh-registration.pdf', '2024-02-07T10:00:00Z'),
    linkedTrustId: 1,
    status: false,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
    activity: [{ id: 1, action: 'Sangh Created', timestamp: '2024-01-01T10:00:00Z', user: 'Admin' }]
  },
  {
    id: 104,
    name: 'Rajkot Jain Sangh',
    mainPersonName: 'Ashok Boda',
    mobile: '+91 98765 43217',
    email: 'ashok@rajkotsangh.org',
    address: 'Kalavad Road',
    area: 'Kalavad Road',
    city: 'Rajkot',
    state: 'Gujarat',
    totalFamilies: 180,
    totalMembers: 620,
    about: 'Rajkot region Jain sangh, active in social welfare.',
    committee: [
      createCommitteeMember(1041, 'Ashok Boda', 'President', '+91 98765 43217', 'ashok@rajkotsangh.org', 'Kalavad Road', 'Rajkot', true),
      createCommitteeMember(1042, 'Dharmesh Jain', 'Teacher', '+91 98765 43226', 'dharmesh@rajkotsangh.org', 'Race Course', 'Rajkot', true),
    ],
    document: createDocument('Rajkot Sangh Report', 'rajkot-sangh-report.pdf', '2024-02-10T10:00:00Z'),
    linkedTrustId: 4,
    status: true,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
    activity: [{ id: 1, action: 'Sangh Created', timestamp: '2024-01-01T10:00:00Z', user: 'Admin' }]
  },
  {
    id: 105,
    name: 'Vadodara Jain Sangh',
    mainPersonName: 'Mahesh Jain',
    mobile: '+91 98765 43218',
    email: 'mahesh@vadodarasangh.org',
    address: 'Alkapuri',
    area: 'Alkapuri',
    city: 'Vadodara',
    state: 'Gujarat',
    totalFamilies: 220,
    totalMembers: 780,
    about: 'Vadodara Jain community sangh, active in educational programs.',
    committee: [
      createCommitteeMember(1051, 'Mahesh Jain', 'President', '+91 98765 43218', 'mahesh@vadodarasangh.org', 'Alkapuri', 'Vadodara', true),
      createCommitteeMember(1052, 'Sonal Shah', 'Secretary', '+91 98765 43227', 'sonal@vadodarasangh.org', 'Fatehgunj', 'Vadodara', true),
    ],
    document: createDocument('Vadodara Sangh Profile', 'vadodara-sangh-profile.pdf', '2024-02-13T10:00:00Z'),
    linkedTrustId: 2,
    status: true,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
    activity: [{ id: 1, action: 'Sangh Created', timestamp: '2024-01-01T10:00:00Z', user: 'Admin' }]
  }
];

export const INITIAL_LINKS = [
  { id: 1, trustId: 1, sanghId: 101, linkedAt: '2020-01-01', status: true },
  { id: 2, trustId: 1, sanghId: 103, linkedAt: '2020-06-15', status: true },
  { id: 3, trustId: 2, sanghId: 101, linkedAt: '2019-03-10', status: true },
  { id: 4, trustId: 3, sanghId: 102, linkedAt: '2021-02-20', status: true },
  { id: 5, trustId: 4, sanghId: 104, linkedAt: '2018-11-30', status: true }
];

// Add this export - INITIAL_DEPARTMENTS
export const INITIAL_DEPARTMENTS = [
  { id: 1, name: 'Accounts & Finance', head: 'Nirav Shah', members: 5 },
  { id: 2, name: 'Donation Management', head: 'Mehul Mehta', members: 8 },
  { id: 3, name: 'Event Management', head: 'Rakesh Jain', members: 12 },
];

function normalizeTrust(trust, index) {
  const fallback = INITIAL_TRUSTS.find((item) => item.id === trust?.id) || {
    ...createTrustDraft(),
    id: trust?.id || Date.now() + index,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    activity: [{ id: Date.now() + index, action: 'Trust Created', timestamp: new Date().toISOString(), user: 'Admin' }]
  };

  return {
    ...fallback,
    ...trust,
    team: Array.isArray(trust?.team) && trust.team.length ? trust.team : fallback.team,
    document: trust?.document || fallback.document,
    linkedSanghs: Array.isArray(trust?.linkedSanghs) && trust.linkedSanghs.length ? trust.linkedSanghs : fallback.linkedSanghs,
    activity: Array.isArray(trust?.activity) && trust.activity.length ? trust.activity : fallback.activity,
  };
}

function normalizeSangh(sangh, index) {
  const fallback = INITIAL_SANGHS.find((item) => item.id === sangh?.id) || {
    ...createSanghDraft(),
    id: sangh?.id || Date.now() + index,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    activity: [{ id: Date.now() + index, action: 'Sangh Created', timestamp: new Date().toISOString(), user: 'Admin' }]
  };

  return {
    ...fallback,
    ...sangh,
    committee: Array.isArray(sangh?.committee) && sangh.committee.length ? sangh.committee : fallback.committee,
    document: sangh?.document || fallback.document,
    linkedTrustId: sangh?.linkedTrustId || fallback.linkedTrustId,
    activity: Array.isArray(sangh?.activity) && sangh.activity.length ? sangh.activity : fallback.activity,
  };
}

const STORAGE_KEY = 'org_management_final_v2';
const TRUSTS_KEY = 'org_trusts';
const SANGHS_KEY = 'org_sanghs';
const LINKS_KEY = 'org_links';
const DEPARTMENTS_KEY = 'org_departments';

function readStoredJson(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (error) {
    return fallback;
  }
}

export const getOrgData = () => {
  const saved = readStoredJson(STORAGE_KEY, null);

  if (saved && Array.isArray(saved.trusts) && Array.isArray(saved.sanghs) && Array.isArray(saved.links)) {
    return {
      trusts: saved.trusts.map(normalizeTrust),
      sanghs: saved.sanghs.map(normalizeSangh),
      links: saved.links,
    };
  }

  return {
    trusts: readStoredJson(TRUSTS_KEY, INITIAL_TRUSTS).map(normalizeTrust),
    sanghs: readStoredJson(SANGHS_KEY, INITIAL_SANGHS).map(normalizeSangh),
    links: readStoredJson(LINKS_KEY, INITIAL_LINKS),
  };
};

export const saveOrgData = (data) => {
  const nextData = {
    trusts: Array.isArray(data?.trusts) ? data.trusts.map(normalizeTrust) : INITIAL_TRUSTS,
    sanghs: Array.isArray(data?.sanghs) ? data.sanghs.map(normalizeSangh) : INITIAL_SANGHS,
    links: Array.isArray(data?.links) ? data.links : INITIAL_LINKS,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextData));
  localStorage.setItem(TRUSTS_KEY, JSON.stringify(nextData.trusts));
  localStorage.setItem(SANGHS_KEY, JSON.stringify(nextData.sanghs));
  localStorage.setItem(LINKS_KEY, JSON.stringify(nextData.links));
  localStorage.setItem(DEPARTMENTS_KEY, JSON.stringify(INITIAL_DEPARTMENTS));
};

export const getTrustName = (trustId, trusts) => {
  const trust = trusts.find(t => t.id === trustId);
  return trust ? trust.name : 'Unknown Trust';
};

export const getSanghName = (sanghId, sanghs) => {
  const sangh = sanghs.find(s => s.id === sanghId);
  return sangh ? sangh.name : 'Unknown Sangh';
};

export const getDeptName = (deptId, departments = INITIAL_DEPARTMENTS) => {
  const department = departments.find(d => d.id === deptId);
  return department ? department.name : 'Unknown Department';
};

export const addActivity = (item, action, user = 'Admin') => {
  const newActivity = {
    id: Date.now(),
    action,
    timestamp: new Date().toISOString(),
    user
  };
  item.activity = item.activity || [];
  item.activity.unshift(newActivity);
  item.updatedAt = new Date().toISOString();
  return item;
};
