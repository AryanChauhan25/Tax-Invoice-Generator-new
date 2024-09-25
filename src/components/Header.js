import { Banknote } from "lucide-react"

export default function Header() {
  return (
    <header className="bg-primary text-primary-foreground py-8 px-4 shadow-md rounded-b-[50px] mb-6">
      <div className="container mx-auto flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Banknote className="w-8 h-8" />
          <h1 className="text-3xl font-bold" style={{fontWeight: 700}}>Tax Invoice Generator</h1>
          <br></br>
        </div>
      </div>
    </header>
  )
}