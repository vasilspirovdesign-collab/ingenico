export const DEVICES = [
  { id: 1,  name: 'Sofia-Checkout-01',      imei: '354 882 11 23456 7', fleet: 'Retail — Sofia Central',      status: 'Online',  config: 'Sofia-Retail-v3.2.0'    },
  { id: 2,  name: 'Plovdiv-Kiosk-A',        imei: '354 882 11 65432 1', fleet: 'Retail — Plovdiv South',      status: 'Online',  config: 'Plovdiv-Retail-v3.2.0'  },
  { id: 3,  name: 'Varna-Counter-03',       imei: '354 882 11 65432 2', fleet: 'Hospitality — Varna Coast',   status: 'Offline', config: 'Varna-Hospitality-v2.9.4'},
  { id: 4,  name: 'Burgas-Mobile-POS-2',    imei: '354 882 11 65432 3', fleet: 'Pharmacy — Burgas',           status: 'Online',  config: 'PCI-Compliant-v4.1.0'   },
  { id: 5,  name: 'Ruse-Till-B',            imei: '354 882 11 65432 4', fleet: 'Franchise — Ruse',            status: 'Online',  config: 'Bulgaria-Base-v1.0.0'   },
  { id: 6,  name: 'Stara-Zagora-Bar-1',     imei: '354 882 11 65432 5', fleet: 'Hospitality — Bansko Resort', status: 'Error',   config: 'Bansko-Resort-v2.10.0'  },
  { id: 7,  name: 'Pleven-Drive-Thru-1',    imei: '354 882 11 65432 6', fleet: 'Fuel — Trakia Highway',       status: 'Online',  config: 'Trakia-Fuel-v1.3.0'     },
  { id: 8,  name: 'Blagoevgrad-Self-Serve-2',imei: '354 882 11 65432 7',fleet: 'Retail — Sofia Central',      status: 'Offline', config: 'NFC-Enabled-v2.0.0'     },
  { id: 9,  name: 'Sliven-Gate-POS-1',      imei: '354 882 11 65432 8', fleet: 'Events — Sofia Arena',        status: 'Online',  config: 'Bulgaria-Base-v1.0.0'   },
  { id: 10, name: 'Dobrich-Pharmacy-01',    imei: '354 882 11 65432 9', fleet: 'Pharmacy — Burgas',           status: 'Offline', config: 'PCI-Compliant-v4.1.0'   },
]

export const STATS = [
  { label: 'Total devices',   value: 142 },
  { label: 'Online',          value: 128 },
  { label: 'Offline',         value: 11  },
  { label: 'Needs attention', value: 3   },
]
