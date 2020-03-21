import * as express from 'express';
import { google } from 'googleapis';
import * as jwt from 'jsonwebtoken';
import { prisma } from '../generated/prisma-client';

const { OAuth2 } = google.auth;

const is_production = process.env.NODE_ENV === 'production';

const router = express.Router();

const oauth2Client = new OAuth2(
  process.env.GOOGLE_OAUTH2_CLIENT_ID,
  process.env.GOOGLE_OAUTH2_CLIENT_SECRET,
  process.env.GOOGLE_OAUTH2_REDIRECT_URI,
);

const loginLink = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['profile', 'email'],
});

router.get('/google/login', (req, res) => {
  return res.redirect(loginLink);
});

router.get('/google/callback', async (req, res) => {
  if (req.query.error) {
    return res.redirect('/');
  } else {
    const { tokens } = await oauth2Client.getToken({ code: req.query.code });
    oauth2Client.setCredentials(tokens);

    const { data: { email, name } } = await google
      .oauth2({ auth: oauth2Client, version: 'v2' })
      .userinfo
      .get({ oauth_token: tokens.access_token });

    const user = await prisma.user({ email });

    const id: string = user ? user.id
      : (await prisma.createUser({ email, name })).id;

    oauth2Client.setCredentials({});

    res.cookie(
      'user',
      jwt.sign({ id, email, name }, process.env.JWTSECRET),
      { domain: is_production ? '.now.sh' : 'localhost', httpOnly: true, secure: true },
    );
    return res.redirect(is_production ? 'https://iwillread.now.sh/' : 'http://localhost:3000/');
  }
});

export default router;