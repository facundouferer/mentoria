import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';


export async function POST(request) {
  try {
    const { title, id, url } = await request.json();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      subject: 'Artículo Reportado',
      html: `
        <p>El siguiente artículo ha sido reportado:</p>
        <p><strong>Título:</strong> ${title}</p>
        <p><strong>ID:</strong> ${id}</p>
        <p><strong>Link:</strong> <a href="${url}">${url}</a></p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Error al enviar el reporte' },
      { status: 500 }
    );
  }
}