/**
 * Express router paths go here.
 */

export default {
  Base: '/',
  Customer: {
    Base: '/customer',
    One: '/:customerId',
    AuthUrl: '/authurl',
    Auth: '/auth',
    Token: '/token',
    Verification: '/token/verification'
  },
  Admin: {
    Base: '/admin',
    One: '/:adminId',
    Token: '/token',
    Verification: '/token/verification'
  },
  Scooter: {
    Base: '/scooter',
    One: '/:scooterId',
    Token: '/token',
    Verification: '/token/verification'
  },
  Trip: {
    Base: '/trip',
    One: '/:tripId'
  },
  Zone: {
    Base: '/zone',
    One: '/:zoneId'
  },
  Parking: {
    Base: '/parking',
    One: '/:parkingId',
    Zone: '/zone/:zoneId',
    Scooter: '/scooter/:scooterId'
  }
} as const;
