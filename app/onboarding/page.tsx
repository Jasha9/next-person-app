import { auth } from "@/app/auth";
import OnboardingForm from "@/app/components/onboarding-form";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/landing");
  }

  return <OnboardingForm />;
}