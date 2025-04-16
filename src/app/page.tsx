import PDFConverter from "./component/PDFConverter";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center font-[family-name:var(--font-geist-sans)]">
      <main>
        <PDFConverter />
      </main>
    </div>
  );
}
