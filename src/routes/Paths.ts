/**
 * Express router paths go here.
 */

export default {
    Base: '/',
    Customer: {
        Base: '/customer',
        One: '/:customerId',
        Auth: '/auth',
        Token: '/token'
    },
    Admin: {
        Base: '/admin',
        One: '/:adminId',
        Token: '/token',
        Setup: '/setup'
    },
    Scooter: {
        Base: '/scooter',
        One: '/:scooterId',
        Token: '/token'
    },
    Trip: {
        Base: '/trip',
        One: '/:tripId',
        Customer: '/by/customer/:customerId',
        Scooter: '/by/scooter/:scooterId'
    },
    Zone: {
        Base: '/zone',
        One: '/:zoneId'
    },
    Parking: {
        Base: '/parking',
        One: '/:parkingId',
        Zone: '/by/zone/:zoneId',
        Scooter: '/by/scooter/:scooterId'
    }
} as const;
