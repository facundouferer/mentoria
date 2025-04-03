import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { username, password } = credentials;

        try {
          const connection = await pool.getConnection();
          const [rows] = await connection.execute(
            "SELECT userid, username, password, email FROM users WHERE username = ?",
            [username]
          );
          connection.release();

          if (rows.length === 0) {
            return null; // Usuario no encontrado
          }

          const user = rows[0];

          // Comparar la contraseña con la de la base de datos
          const isValid = await bcrypt.compare(password, user.password);

          if (!isValid) {
            return null; // Incorrecto
          }

          return {
            id: user.userid.toString(),
            name: user.username,
            email: user.email,
          };
        } catch (error) {
          console.error("Error en la autenticación:", error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
