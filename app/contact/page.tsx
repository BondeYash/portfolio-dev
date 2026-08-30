import type { Metadata } from "next";
import { ContactView } from "@/components/contact/contact-view";
import { profile } from "@/data/profile";

export const metadata: Metadata = {
  title: "Contact",
  description: `Reach ${profile.fullName} in ${profile.location}.`,
};

export default function ContactPage() {
  return <ContactView />;
}
