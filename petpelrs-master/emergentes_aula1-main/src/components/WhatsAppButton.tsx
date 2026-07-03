export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/5553991706490?text=Ol%C3%A1!%20Vim%20do%20PetPel%20RS%20"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 animate-pulse"
      title="Fale conosco no WhatsApp"
    >
      <img src="/img/logozap.png" alt="WhatsApp" className="h-8 w-8" />
    </a>
  );
}
