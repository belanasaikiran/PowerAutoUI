import Image from "next/image";

export default function ChatWindow() {
  return (
    <div className="flex gap-2 justify-between min-w-full sticky ">
      <div className="flex">
        <Image
          className="rounded-xl"
          src="/logo.png"
          alt="Logo"
          width={80}
          height={80}
        />
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
