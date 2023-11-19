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
    Token: '/token'
  },
  Scooter: {
    Base: '/scooter',
    One: '/:scooterId',
    Token: '/token'
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
