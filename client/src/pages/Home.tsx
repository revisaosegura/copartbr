import { useEffect } from "react";

const COPART_DOMAIN = "copartbr.com.br";
const COPART_URL = `https://${COPART_DOMAIN}/`;

export default function Home() {
  useEffect(() => {
    if (
      import.meta.env.PROD &&
      typeof window !== "undefined" &&
      window.location.hostname !== COPART_DOMAIN
    ) {
      const target = new URL(window.location.href);
      target.protocol = "https:";
      target.hostname = COPART_DOMAIN;
      target.port = "";

      window.location.replace(target.toString());
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#003087] text-white p-6 text-center">
      <h1 className="text-2xl md:text-3xl font-bold">Redirecionando para Copart Brasil</h1>
      <p className="text-base md:text-lg max-w-xl">
        Se o redirecionamento não ocorrer automaticamente, acesse{" "}
        <a href={COPART_URL} className="underline font-semibold" rel="noopener noreferrer">
          {COPART_URL}
        </a>
        .
      </p>
    </div>
  );
}
