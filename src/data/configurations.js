export const CONFIGURATIONS = [
  { id: 1,  name: 'Banking-Sofia-v4.2.0',  fleet: 'Banking - Sofia City',   status: 'Offline', os: '8.4.2' },
  { id: 2,  name: 'Banking-Varna-v4.2.0',  fleet: 'Banking - Varna City',   status: 'Online',  os: '8.4.3' },
  { id: 3,  name: 'Banking-Burgas-v4.2.0', fleet: 'Banking - Burgas City',  status: 'Online',  os: '8.4.4' },
  { id: 4,  name: 'Banking-Plovdiv-v4.2.0',fleet: 'Banking - Plovdiv City', status: 'Offline', os: '8.4.5' },
  { id: 5,  name: 'Retail-Sofia-v3.1.3',   fleet: 'Retail - Sofia City',    status: 'Online',  os: '8.4.5' },
  { id: 6,  name: 'Retail-Sofia-v3.1.3',   fleet: 'Retail - Sofia City',    status: 'Error',   os: '8.4.5' },
  { id: 7,  name: 'Retail-Sofia-v3.1.0',   fleet: 'Retail - Sofia City',    status: 'Online',  os: '8.4.5' },
  { id: 8,  name: 'Retail-Varna-v3.1.0',   fleet: 'Retail - Varna City',    status: 'Online',  os: '8.4.5' },
  { id: 9,  name: 'Retail-Burgas-v3.0.1',  fleet: 'Retail - Burgas City',   status: 'Offline', os: '8.4.3' },
  { id: 10, name: 'Staging-v1.0.0',         fleet: 'Staging',                status: 'Offline', os: '8.5.0' },
]

export const CONFIG_STATS = [
  { label: 'Total configs', value: 14 },
  { label: 'Active',        value: 6  },
  { label: 'Deploying',     value: 2  },
  { label: 'Drafts',        value: 3  },
]
