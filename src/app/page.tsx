import BeautifulSearchBar from "./component/BeautifulSearchBar";

export default function Home(props) {
  return (
    <div className="min-h-screen flex items-center justify-center font-[family-name:var(--font-geist-sans)]">
      <main>
        <BeautifulSearchBar />
      </main>
    </div>
  );
}
