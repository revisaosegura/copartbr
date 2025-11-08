import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2 } from "lucide-react";
import { Link } from "wouter";

export default function VenderMeuCarro() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-[#002366] via-[#003087] to-[#004099] text-white py-16">
          <div className="container">
            <h1 className="text-5xl font-bold mb-6">Vender Meu Carro</h1>
            <p className="text-xl text-gray-200">Venda seu veículo de forma rápida, segura e sem complicações.</p>
          </div>
        </section>
        <section className="py-16">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold text-[#003087] mb-6">Por que vender com a Copart?</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="text-[#FDB714] mt-1 flex-shrink-0" size={24} />
                    <div><strong>Alcance Nacional:</strong> Milhares de compradores em todo o Brasil</div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="text-[#FDB714] mt-1 flex-shrink-0" size={24} />
                    <div><strong>Processo Seguro:</strong> Toda transação é intermediada pela Copart</div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="text-[#FDB714] mt-1 flex-shrink-0" size={24} />
                    <div><strong>Você Define o Preço:</strong> Estabeleça o valor mínimo de venda</div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="text-[#FDB714] mt-1 flex-shrink-0" size={24} />
                    <div><strong>Pagamento Garantido:</strong> Receba de forma rápida e segura</div>
                  </div>
                </div>
              </div>
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-[#003087] mb-6">Cadastre seu Veículo</h3>
                  <form className="space-y-4">
                    <div><Input placeholder="Marca" /></div>
                    <div><Input placeholder="Modelo" /></div>
                    <div><Input placeholder="Ano" /></div>
                    <div><Input placeholder="Placa" /></div>
                    <div><Input placeholder="Quilometragem" /></div>
                    <div><Input placeholder="Seu Nome" /></div>
                    <div><Input type="email" placeholder="Seu Email" /></div>
                    <div><Input type="tel" placeholder="Seu Telefone" /></div>
                    <Button className="w-full bg-[#FDB714] hover:bg-[#e5a512] text-black font-semibold">
                      Solicitar Avaliação
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
