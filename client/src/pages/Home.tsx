import { useEffect } from "react";

const COPART_URL = "https://www.copart.com.br/";

export default function Home() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.href !== COPART_URL) {
      window.location.replace(COPART_URL);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#003087] text-white p-6 text-center">
      <h1 className="text-2xl md:text-3xl font-bold">Redirecionando para Copart Brasil</h1>
      <p className="text-base md:text-lg max-w-xl">
        Se o redirecionamento não ocorrer automaticamente, acesse
        {" "}
        <a href={COPART_URL} className="underline font-semibold" rel="noopener noreferrer">
          {COPART_URL}
        </a>
        .
      </p>
    </div>
  );
}
