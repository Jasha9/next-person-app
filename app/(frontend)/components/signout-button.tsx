"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import React from "react";

function SignoutButton() {
  return (
    <Button
      variant="ghost"
      size="icon"
      title="Sign Out"
      onClick={() => signOut()}
    >
      <LogOut className="h-5 w-5" />
    </Button>
  );
}

export default SignoutButton;
