export const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';

export const googleConfig = {
  clientId: GOOGLE_CLIENT_ID,
  scope: 'openid email profile',
  prompt: 'select_account',
};

export const isNortheasternEmail = (email) => {
  return email && (email.toLowerCase().endsWith('@northeastern.edu') || email.toLowerCase().endsWith('@husky.neu.edu'));
};

export const extractUserInfo = (googleUser) => {
  return {
    googleId: googleUser.sub,
    email: googleUser.email,
    name: googleUser.name,
    picture: googleUser.picture,
    givenName: googleUser.given_name,
    familyName: googleUser.family_name,
  };
}; 