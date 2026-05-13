import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import prisma from "../lib/prisma";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/auth/google/callback",
      passReqToCallback: true,
    },
    async (req, _accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value!;
        const oauthState = req.query.state as string | undefined;

        const requestedRole = oauthState === "employer" ? "employer" : "student";

        const existingUser = await prisma.user.findUnique({
          where: { email },
        });

        // 🚨 ADMIN ALWAYS ALLOWED
        if (existingUser && existingUser.role === "admin") {
          return done(null, existingUser);
        }

        // 🚫 Block role mismatch ONLY for non-admins
        if (existingUser && existingUser.role !== requestedRole) {
          return done(null, false, {
            message: `User already exists as ${existingUser.role}`,
          });
        }

        // ✅ User exists & role matches
        if (existingUser) {
          return done(null, existingUser);
        }

        // ✅ New user → create with role
        const newUser = await prisma.user.create({
          data: {
            googleId: profile.id,
            email,
            name: profile.displayName,
            image: profile.photos?.[0].value,
            role: requestedRole,
          },
        });

        return done(null, newUser);
      } catch (error) {
        return done(error as any, undefined);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});

export default passport;