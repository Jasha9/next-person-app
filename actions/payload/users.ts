"use server";

import payloadConfig from "@/payload.config";
import { getPayload } from "payload";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function syncUser(user: any) {
  const payload = await getPayload({ config: payloadConfig });

  const existing = await payload.find({
    collection: "users",
    where: { email: { equals: user.email } },
  });

  let newUser = null;

  if (existing.docs.length > 0) {
    newUser = await payload.update({
      collection: "users",
      id: existing.docs[0].id,
      data: { name: user.name },
    });
  } else {
    newUser = await payload.create({
      collection: "users",
      data: {
        email: user.email,
        name: user.name,
        password: user.password || crypto.randomUUID(), // Provide a password,
      },
    });

    const token = await payload.forgotPassword({
      collection: "users",
      data: {
        email: user.email,
      },
      disableEmail: false,
    });

    console.log("Token sent to email:", token);
  }

  return newUser;
}
