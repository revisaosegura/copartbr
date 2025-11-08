import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function AcharPecas() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-[#002366] via-[#003087] to-[#004099] text-white py-16">
          <div className="container">
            <h1 className="text-5xl font-bold mb-6">Achar Peças</h1>
            <p className="text-xl text-gray-200">Encontre peças automotivas de qualidade para seu veículo.</p>
          </div>
        </section>
        <section className="py-16">
          <div className="container">
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-[#003087] mb-6">Buscar Peças</h2>
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); toast.info("Funcionalidade em breve!"); }}>
                  <div><Input placeholder="Marca do Veículo" /></div>
                  <div><Input placeholder="Modelo do Veículo" /></div>
                  <div><Input placeholder="Ano" /></div>
                  <div><Input placeholder="Peça que você procura" /></div>
                  <Button type="submit" className="w-full bg-[#FDB714] hover:bg-[#e5a512] text-black font-semibold">
                    Buscar Peças
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
