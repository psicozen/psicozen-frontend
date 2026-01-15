
import Link from "next/link"
import { Button } from "@/shared/ui/button"
import { FileQuestion, Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="glass mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 shadow-lg">
        <FileQuestion className="h-12 w-12 text-primary" />
      </div>
      <h1 className="mb-2 text-4xl font-bold tracking-tight text-primary">
        Página não encontrada
      </h1>
      <p className="mb-8 max-w-md text-lg text-foreground">
        Desculpe, não conseguimos encontrar a página que você está procurando. Ela pode ter sido removida ou o
        link pode estar incorreto.
      </p>
      <Link href="/">
        <Button size="lg" className="gap-2 shadow-xl transition-transform hover:scale-105">
          <Home className="h-4 w-4" />
          Voltar para o Início
        </Button>
      </Link>
    </div>
  )
}
