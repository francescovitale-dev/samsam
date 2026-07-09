import NextAuth from "next-auth";
import Nodemailer from "next-auth/providers/nodemailer";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { isAllowed } from "@/lib/allowlist";
import { sendEmail } from "@/lib/email";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  trustHost: true,
  pages: { signIn: "/login", verifyRequest: "/login?check=1", error: "/login" },
  providers: [
    Nodemailer({
      // A transport is required by the provider type but is never used:
      // sendVerificationRequest is fully overridden below (Resend or console).
      server: { host: "localhost", port: 587 },
      from: process.env.EMAIL_FROM || "SamSam <offertes@samsam.nu>",
      maxAge: 24 * 60 * 60,
      async sendVerificationRequest({ identifier, url }) {
        await sendEmail({
          to: identifier,
          subject: "Inloggen bij SamSam Offertes",
          text: `Klik om in te loggen:\n${url}\n\nDeze link is 24 uur geldig.`,
          html: `<div style="font-family:Arial,sans-serif;font-size:15px;color:#2b2f36">
            <p>Klik op de knop om in te loggen bij <b>SamSam Offertes</b>:</p>
            <p><a href="${url}" style="display:inline-block;background:#9EC63F;color:#173a12;
              font-weight:bold;padding:12px 20px;border-radius:8px;text-decoration:none">Inloggen</a></p>
            <p style="color:#6b7280;font-size:13px">Of plak deze link: <br>${url}<br><br>
              Deze link is 24 uur geldig. Heb je dit niet aangevraagd? Negeer deze e-mail.</p>
          </div>`,
        });
      },
    }),
  ],
  callbacks: {
    // Allowlist enforcement — only permitted emails may sign in.
    async signIn({ user }) {
      return isAllowed(user?.email);
    },
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        // role is on the DB user
        (session.user as { role?: string }).role =
          (user as { role?: string }).role ?? "member";
      }
      return session;
    },
  },
});
