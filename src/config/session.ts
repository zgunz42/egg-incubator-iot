import * as session from 'express-session';

export const appSession = session({
  secret: 'my-secret-session', // put inside a env file later
  resave: false,
  saveUninitialized: false,
});
