import { MessageCircle } from "lucide-react";

export default function WhatsAppWidget() {
  const whatsappUrl = "http://wa.me/5511921271104";

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 group"
      aria-label="Fale conosco no WhatsApp"
    >
      <MessageCircle size={32} className="group-hover:animate-pulse" />
      <span className="absolute right-full mr-3 px-4 py-2 bg-white text-gray-800 text-sm font-semibold rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
        Fale conosco!
      </span>
    </a>
  );
}
