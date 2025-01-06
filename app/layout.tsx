
import "./global.css";

export const metadata = {
  title: "nextjs-first_chatbot",
  description: "The place to go for all law questions!"
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="ro">
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;