import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { HelpCircle, Mail, Phone, MessageCircle } from "lucide-react";

export default function Suporte() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-[#002366] via-[#003087] to-[#004099] text-white py-16">
          <div className="container">
            <h1 className="text-5xl font-bold mb-6">Central de Suporte</h1>
            <p className="text-xl text-gray-200">Estamos aqui para ajudar você.</p>
          </div>
        </section>
        <section className="py-16">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <Card>
                <CardContent className="p-6 text-center">
                  <Phone className="mx-auto mb-4 text-[#FDB714]" size={48} />
                  <h3 className="text-xl font-bold text-[#003087] mb-2">Telefone</h3>
                  <p className="text-gray-700">+55 11 92127-1104</p>
                  <p className="text-gray-700">(11) 92127-1104</p>
                  <p className="text-sm text-gray-600 mt-2">Seg-Sex: 8h-18h</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Mail className="mx-auto mb-4 text-[#FDB714]" size={48} />
                  <h3 className="text-xl font-bold text-[#003087] mb-2">Email</h3>
                  <p className="text-gray-700">contato@copartbr.com.br</p>
                  <p className="text-sm text-gray-600 mt-2">Resposta em 24h</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <MessageCircle className="mx-auto mb-4 text-[#FDB714]" size={48} />
                  <h3 className="text-xl font-bold text-[#003087] mb-2">Chat Online</h3>
                  <p className="text-gray-700">Atendimento imediato</p>
                  <Button className="mt-4 bg-[#FDB714] hover:bg-[#e5a512] text-black">Iniciar Chat</Button>
                </CardContent>
              </Card>
            </div>
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-[#003087] mb-6">Envie sua Mensagem</h2>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Nome</label>
                    <Input placeholder="Seu nome completo" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Email</label>
                    <Input type="email" placeholder="seu@email.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Assunto</label>
                    <Input placeholder="Qual é o assunto?" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Mensagem</label>
                    <Textarea placeholder="Descreva sua dúvida ou problema..." rows={6} />
                  </div>
                  <Button className="w-full bg-[#FDB714] hover:bg-[#e5a512] text-black font-semibold">
                    Enviar Mensagem
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
