"use client";

import { ColorScheme } from "@/components/ui/colorScheme/colorScheme";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { BadgePlus, ListStart } from "lucide-react";

function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex w-full items-center justify-between mt-2">
      {pathname === "/" ? (
        <Button
          size="icon"
          variant="ghost"
          className="p-5 rounded-full"
          onClick={() => router.push("/create")}
        >
          <BadgePlus className="size-6" />
        </Button>
      ) : (
        <Button
          variant="ghost"
          className="p-6 rounded-full"
          onClick={() => router.push("/")}
        >
          <ListStart className="size-5" />
        </Button>
      )}
      <ColorScheme />
    </div>
  );
}

export default Navbar;
