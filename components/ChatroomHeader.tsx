import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { Link } from "@/i18n/navigation";
import LeaveChatRoomButton from "./LeaveChatRoomButton";

export default function ChatroomHeader({
  opponent,
  opponentId,
  chatRoomId,
  showLeave = false,
}: {
  opponent: string;
  opponentId: number;
  chatRoomId: string;
  showLeave?: boolean;
}) {
  return (
    <div className="flex items-center border-b border-neutral-700 py-3">
      <Link href={"/chats"} className="flex-1">
        <ChevronLeftIcon className="size-5 text-white hover:text-neutral-400" />
      </Link>
      <Link
        href={`/users/${opponentId}`}
        className="absolute left-1/2 -translate-x-1/2 text-white hover:text-orange-400 transition-colors"
      >
        {opponent}
      </Link>
      {showLeave && <LeaveChatRoomButton chatRoomId={chatRoomId} />}
    </div>
  );
}
