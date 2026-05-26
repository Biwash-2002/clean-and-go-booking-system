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
