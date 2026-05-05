import Link from "next/link";
export default function Home() {
 
  return (
    <>
      <h1 className="text-7xl font-bold text-center mx-auto max-w-3xl text-glow slide-in-right delay-200">Welcome to bots management</h1>
      <h3 className="text-3xl font-bold text-center mt-10 mx-auto max-w-3xl text-glow slide-in-right delay-200">Bots management is a website for creating and managing bots for platforms,like Discord,Telegram,Reddit,Github Events,Youtube,etc.</h3>
      <div className="flex justify-center mt-10 gap-4 slide-in-right delay-200">
        <Link href="/register">
          <button className="bg-[#1E88E5] hover:bg-[#1565C0] shadow-[0_0_8px_#42A5F5] border border-white/20 text-white font-bold text-glow py-2 px-4 rounded">Get Started</button>
        </Link>
        <Link href="/login">
          <button className="bg-[#616161] hover:bg-[#424242] shadow-md shadow-black/30 border border-white/20 text-white font-bold text-glow py-2 px-4 rounded">Login</button>
        </Link>
      </div>
    </>
  );
}
