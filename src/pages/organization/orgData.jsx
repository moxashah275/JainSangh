import React from 'react';

export const mockOrgs = [
  {
    id: 'ORG001',
    name: 'Shree Navkar Mahasangh',
    type: 'Sangh',
    contactPerson: 'Kiritbhai Shah',
    phone: '+91 9825012345',
    email: 'navkar@example.com',
    status: 'Active',
    address: 'Paldi, Ahmedabad',
    createdDate: '2026-01-15'
  },
  {
    id: 'ORG002',
    name: 'Jain Kalyan Trust',
    type: 'Trust',
    contactPerson: 'Rameshbhai Mehta',
    phone: '+91 9898054321',
    email: 'kalyantrust@example.com',
    status: 'Active',
    address: 'C.G. Road, Ahmedabad',
    createdDate: '2026-02-01'
  },
  {
    id: 'ORG003',
    name: 'Adinath Seva Sangh',
    type: 'Sangh',
    contactPerson: 'Gautambhai Jhaveri',
    phone: '+91 9426098765',
    email: 'adinath@example.com',
    status: 'Inactive',
    address: 'Navrangpura, Ahmedabad',
    createdDate: '2026-03-10'
  }
];

export const INITIAL_TRUSTS = [
  { id: 1, name: "Jain Kalyan Trust" },
  { id: 2, name: "Shree Mahavir Trust" }
];

export const INITIAL_SANGHS = [
  { id: 1, name: "Shree Navkar Mahasangh" },
  { id: 2, name: "Adinath Seva Sangh" }
];

export const INITIAL_DEPARTMENTS = [
  { id: 1, name: "Admin" },
  { id: 2, name: "Finance" },
  { id: 3, name: "Volunteer" }
];


export function getTrustName(trustId) {
  var trust = INITIAL_TRUSTS.find(function(t) { return t.id === parseInt(trustId) });
  return trust ? trust.name : '-';
}


export function getSanghName(sanghId) {
  var sangh = INITIAL_SANGHS.find(function(s) { return s.id === parseInt(sanghId) });
  return sangh ? sangh.name : '-';
}

export function getDeptName(deptId) {
  var dept = INITIAL_DEPARTMENTS.find(function(d) { return d.id === parseInt(deptId) });
  return dept ? dept.name : '-';
}


export default function orgData() {
  return null;
}