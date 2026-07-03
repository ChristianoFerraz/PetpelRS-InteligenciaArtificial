import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
})

export async function enviarEmail(destinatario: string, assunto: string, corpoHtml: string) {
  console.log("=== TENTANDO ENVIAR EMAIL ===")
  console.log("GMAIL_USER:", process.env.GMAIL_USER ? "DEFINIDO" : "NÃO DEFINIDO")
  console.log("GMAIL_APP_PASSWORD:", process.env.GMAIL_APP_PASSWORD ? "DEFINIDO" : "NÃO DEFINIDO")
  console.log("Destinatário:", destinatario)
  
  try {
    const info = await transporter.sendMail({
      from: `"PetPel" <${process.env.GMAIL_USER}>`,
      to: destinatario,
      subject: assunto,
      html: corpoHtml
    })

    console.log("✅ E-mail enviado com sucesso:", info.messageId)
    return info
  } catch (error) {
    console.error("❌ Erro ao enviar e-mail:", error)
    throw error
  }
}
