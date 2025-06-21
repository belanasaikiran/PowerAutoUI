import Image from "next/image";

export default function ChatWindow() {
  return (
    <div className="flex gap-2 justify-between min-w-full sticky ">
      <div className="flex">
        <Image src="/logo.png" alt="Logo" width={100} height={100} />
        PowerAuto
      </div>
      <div>
        <a
          href="https://www.powerauto.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source Code
        </a>
      </div>
    </div>
  );
}
