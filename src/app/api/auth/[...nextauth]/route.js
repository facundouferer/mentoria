// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Credentials")
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. username, password, email, etc.
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Add logic here to look up the user from the credentials supplied
        const { username, password } = credentials;

        // Replace with your hardcoded credentials (for development only!)
        if (username === "testuser" && password === "password123") {
          // Any object returned will be saved in `session`
          return { id: "1", name: "Test User", email: "test@example.com" }; //User object
        } else {
          // If you return null then an error will be displayed advising the user it's an incorrect username or password.
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };