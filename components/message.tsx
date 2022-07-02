import Image from "next/image";
import { cfimg, cls } from "../libs/client/utils";

interface MessageProps {
  message: string;
  reversed?: boolean;
  avatarUrl?: string;
}

export default function Message({
  message,
  avatarUrl,
  reversed,
}: MessageProps) {
  return (
    <div
      className={cls(
        "flex  items-start space-x-2",
        reversed ? "flex-row-reverse space-x-reverse" : ""
      )}
    >
      {avatarUrl ? (
        <Image src={cfimg(avatarUrl, "avatar")} alt="" width={32} height={32} />
      ) : (
        <div className="w-8 h-8 rounded-full bg-slate-400" />
      )}
      <div className="w-1/2 text-sm text-gray-700 p-2 border border-gray-300 rounded-md">
        <p>{message}</p>
      </div>
    </div>
  );
}
