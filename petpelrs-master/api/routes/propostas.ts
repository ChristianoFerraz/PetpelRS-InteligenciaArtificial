import { PrismaClient } from "@prisma/client"
import { Router } from "express"
import { z } from "zod"
import { enviarEmail } from "../utils/email"

const prisma = new PrismaClient()
const router = Router()

// =====================
// Schema de validação
// =====================
const contatoSchema = z.object({
  mensagem: z.string().min(2),
  remetenteId: z.number(),
  destinatarioId: z.number(),
  animalId: z.number(),
})

// =====================
// 📤 ENVIAR MENSAGEM
// =====================
router.post("/", async (req, res) => {
  const valida = contatoSchema.safeParse(req.body)

  if (!valida.success) {
    return res.status(400).json({ erros: valida.error.errors })
  }

  const { mensagem, remetenteId, destinatarioId, animalId } = valida.data

  try {
    // ❌ evita falar consigo mesmo
    if (remetenteId === destinatarioId) {
      return res
        .status(400)
        .json({ erro: "Você não pode conversar consigo mesmo" })
    }

    // 🔎 valida animal
    const animal = await prisma.animal.findUnique({
      where: { id: animalId },
      include: {
        usuario: { select: { id: true, email: true } },
      },
    })

    if (!animal) {
      return res.status(404).json({ erro: "Animal não encontrado" })
    }

    // ✅ cria mensagem
    const contato = await prisma.contato.create({
      data: {
        mensagem,
        animalId,
        remetenteId,
        destinatarioId,
      },
      include: {
        animal: true,
        remetente: true,
        destinatario: true,
      },
    })

    // 📧 email para o destinatário
    if (animal.usuario?.email && animal.usuario.id === destinatarioId) {
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e3a8a;">📩 Nova mensagem sobre ${animal.nome}</h2>
          <p>Olá! Você recebeu uma nova mensagem sobre o seu pet <strong>${animal.nome}</strong>.</p>
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #1e3a8a;">
            <p style="margin: 0; font-style: italic;">"${mensagem}"</p>
          </div>
          <p><strong>De:</strong> ${contato.remetente.nome}</p>
          <p style="margin-top: 20px;">
            <a href="https://www.petpelrs.com.br/inbox" 
               style="background: #1e3a8a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Responder mensagem
            </a>
          </p>
          <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">Equipe PetPel RS</p>
        </div>
      `

      try {
        await enviarEmail(
          animal.usuario.email,
          `📩 Nova mensagem sobre ${animal.nome}`,
          html
        )
      } catch (err) {
        console.warn("Erro ao enviar e-mail:", err)
      }
    }

    res.status(201).json(contato)
  } catch (error) {
    console.error(error)
    res.status(500).json({ erro: "Erro ao enviar mensagem" })
  }
})

// =======================================================
// 📥 INBOX — TODAS AS CONVERSAS DO USUÁRIO
// =======================================================
router.get("/inbox/:usuarioId", async (req, res) => {
  const usuarioId = Number(req.params.usuarioId)

  if (!usuarioId) {
    return res.status(400).json({ erro: "usuarioId inválido" })
  }

  try {
    const mensagens = await prisma.contato.findMany({
      where: {
        OR: [
          { remetenteId: usuarioId },
          { destinatarioId: usuarioId },
        ],
      },
      include: {
        animal: true,
        remetente: true,
        destinatario: true,
      },
      orderBy: { criadoEm: "asc" },
    })

    res.json(mensagens)
  } catch (error) {
    console.error(error)
    res.status(500).json({ erro: "Erro ao carregar inbox" })
  }
})

// =======================================================
// 📊 CONTAR MENSAGENS NÃO LIDAS
// =======================================================
router.get("/nao-lidas/:usuarioId", async (req, res) => {
  const usuarioId = Number(req.params.usuarioId)

  if (!usuarioId) {
    return res.status(400).json({ erro: "usuarioId inválido" })
  }

  try {
    const count = await prisma.contato.count({
      where: {
        destinatarioId: usuarioId,
        lida: false,
      },
    })

    res.json({ naoLidas: count })
  } catch (error) {
    console.error(error)
    res.status(500).json({ erro: "Erro ao contar mensagens" })
  }
})

// =======================================================
// ✅ MARCAR MENSAGENS COMO LIDAS (de uma conversa)
// =======================================================
router.patch("/marcar-lidas", async (req, res) => {
  const { usuarioId, animalId, outroUsuarioId } = req.body

  if (!usuarioId || !animalId || !outroUsuarioId) {
    return res.status(400).json({ erro: "Dados incompletos" })
  }

  try {
    await prisma.contato.updateMany({
      where: {
        animalId: Number(animalId),
        destinatarioId: Number(usuarioId),
        remetenteId: Number(outroUsuarioId),
        lida: false,
      },
      data: { lida: true },
    })

    res.json({ sucesso: true })
  } catch (error) {
    console.error(error)
    res.status(500).json({ erro: "Erro ao marcar mensagens como lidas" })
  }
})

export default router
