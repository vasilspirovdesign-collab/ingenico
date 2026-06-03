export const FLEETS = [
  { id: 1,  name: 'Retail - Sofia Central',      devices: 42, online: 38, offline: 4,  config: 'Sofia-Retail-v3.2.0',      os: 'INGCO 9.1.2 - Current', status: 'Active'    },
  { id: 2,  name: 'Retail - Plovdiv South',       devices: 28, online: 25, offline: 3,  config: 'Plovdiv-Retail-v3.2.0',    os: 'INGCO 9.1.2 - Current', status: 'Active'    },
  { id: 3,  name: 'Hospitality - Varna Coast',    devices: 15, online: 12, offline: 3,  config: 'Varna-Hospitality-v2.9.4', os: 'INGCO 8.4.4 - Stable',  status: 'Active'    },
  { id: 4,  name: 'Hospitality - Bansko Resort',  devices: 8,  online: 8,  offline: 0,  config: 'Bansko-Resort-v2.10.0',    os: 'INGCO 8.4.5 - Stable',  status: 'Active'    },
  { id: 5,  name: 'Pharmacy - Burgas',            devices: 6,  online: 4,  offline: 2,  config: 'Burgas-Pharmacy-v4.1.0',   os: 'INGCO 9.1.2 - Current', status: 'Active'    },
  { id: 6,  name: 'Fuel - Trakia Highway',        devices: 12, online: 12, offline: 0,  config: 'Trakia-Fuel-v1.3.0',       os: 'INGCO 9.1.2 - Current', status: 'Deploying' },
  { id: 7,  name: 'Franchise - Ruse',             devices: 9,  online: 7,  offline: 2,  config: 'Ruse-Franchise-v1.0.0',    os: 'INGCO 8.4.3 - Stable',  status: 'Active'    },
  { id: 8,  name: 'Events - Sofia Arena',         devices: 20, online: 20, offline: 0,  config: 'Sofia-Events-v1.0.0',      os: 'INGCO 9.1.2 - Current', status: 'Active'    },
  { id: 9,  name: 'Staging - Sofia Lab',          devices: 6,  online: 3,  offline: 3,  config: null,                       os: 'INGCO 9.2.0 - Beta',    status: 'Drafts'    },
  { id: 10, name: 'Stara Zagora - Bars',          devices: 7,  online: 5,  offline: 2,  config: 'Bars-Resort-v2.10.0',      os: 'INGCO 8.4.5 - Stable',  status: 'Active'    },
  { id: 11, name: 'QA - Plovdiv Office',          devices: 4,  online: 2,  offline: 2,  config: null,                       os: 'INGCO 9.2.0 - Beta',    status: 'Drafts'    },
]

export const FLEET_STATS = [
  { label: 'Total fleets',            value: 11  },
  { label: 'Devices across all fleets', value: 142 },
  { label: 'Healthy',                 value: 8   },
  { label: 'Needs attention',         value: 2   },
]
