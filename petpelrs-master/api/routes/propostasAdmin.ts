import { PrismaClient } from "@prisma/client"
import { Router } from "express"

const prisma = new PrismaClient()
const router = Router()

// ==============================
// 📋 LISTAR TODAS AS MENSAGENS (ADMIN)
// ==============================
router.get("/", async (req, res) => {
  try {
    const contatos = await prisma.contato.findMany({
      include: {
        animal: true,
        remetente: true,
        destinatario: true,
      },
      orderBy: {
        criadoEm: "desc",
      },
    })

    res.status(200).json(contatos)
  } catch (error) {
    console.error(error)
    res.status(500).json({ erro: "Erro ao buscar mensagens" })
  }
})

export default router
