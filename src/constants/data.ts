export const WASH_PACKAGES = [
    // One-Time Plans
    {
        id: 'ot-basic',
        name: 'Basic Wash',
        price: 800,
        planType: 'one-time',
        limit: 1,
        duration: 30,
        description: 'Standard exterior wash',
    },
    {
        id: 'ot-premium',
        name: 'Premium Wash',
        price: 1500,
        planType: 'one-time',
        limit: 1,
        duration: 45,
        description: 'Interior & exterior cleaning',
    },
    {
        id: 'ot-detailing',
        name: 'Full Detailing',
        price: 2200,
        planType: 'one-time',
        limit: 1,
        duration: 60,
        description: 'Professional deep detailing',
    },
    // Subscription Plans
    {
        id: 'sub-basic',
        name: 'Monthly Basic',
        price: 2500,
        planType: 'subscription',
        limit: 4,
        duration: 30,
        description: '4 washes per month',
    },
    {
        id: 'sub-premium',
        name: 'Monthly Premium',
        price: 4500,
        planType: 'subscription',
        limit: 7,
        duration: 45,
        description: '7 washes per month',
    },
    {
        id: 'sub-complex',
        name: 'Monthly Complex',
        price: 6500,
        planType: 'subscription',
        limit: 10,
        duration: 60,
        description: '10 washes per month with interior and exterior detailing',
    }
];

export const WASHING_CENTERS = [
    {
        id: 'abc-point',
        name: 'ABC Point',
        location: 'Kathmandu',
        coords: { lat: 27.7172, lng: 85.3240 },
        address: 'Lazimpat, Kathmandu'
    },
    {
        id: 'efz-point',
        name: 'EFZ Point',
        location: 'Bhaktapur',
        coords: { lat: 27.6710, lng: 85.4298 },
        address: 'Suryabinayak, Bhaktapur'
    },
    {
        id: 'aaa-point',
        name: 'AAA Point',
        location: 'Lalitpur',
        coords: { lat: 27.6644, lng: 85.3188 },
        address: 'Jhamsikhel, Lalitpur'
    },
    {
        id: 'fty-point',
        name: 'FTY Point',
        location: 'Kathmandu',
        coords: { lat: 27.7215, lng: 85.3524 },
        address: 'Bouddha, Kathmandu'
    }
];

export const TIME_SLOTS = [
    '08:00 AM', '08:15 AM', '08:30 AM', '08:45 AM',
    '09:00 AM', '09:15 AM', '09:30 AM', '09:45 AM',
    '10:00 AM', '10:15 AM', '10:30 AM', '10:45 AM',
    '11:00 AM', '11:15 AM', '11:30 AM', '11:45 AM',
    '12:00 PM', '12:15 PM', '12:30 PM', '12:45 PM',
    '01:00 PM', '01:15 PM', '01:30 PM', '01:45 PM',
    '02:00 PM', '02:15 PM', '02:30 PM', '02:45 PM',
    '03:00 PM', '03:15 PM', '03:30 PM', '03:45 PM',
    '04:00 PM', '04:15 PM', '04:30 PM', '04:45 PM',
    '05:00 PM', '05:15 PM', '05:30 PM', '05:45 PM',
    '06:00 PM', '06:15 PM', '06:30 PM', '06:45 PM',
    '07:00 PM', '07:15 PM', '07:30 PM', '07:45 PM'
];
