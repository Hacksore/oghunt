"use server";

import { EmailSource } from "@prisma/client";
import prisma from "../db";
import env from "../env";
export async function subscribeToNewsletter(email: string) {
  try {
    // add them to our internal list as well
    await prisma.emailList.create({
      data: {
        email: email,
        source: EmailSource.Form,
        dailyEmails: true,
      },
    });
  } catch (error) {
    console.error("Failed to add to internal list:", error);
    throw new Error("Failed to add to internal list");
  }

  try {
    const response = await fetch(env.LOOPS_FORM_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        source: "Form",
      }),
    });

  // try {
  //   const response = await fetch(env.LOOPS_FORM_ENDPOINT, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       email,
  //       source: "Form",
  //     }),
  //   });

  //   if (!response.ok) {
  //     throw new Error("Failed to subscribe");
  //   }

  //   return { success: true };
  // } catch (error) {
  //   console.error("Newsletter subscription error:", error);
  //   throw new Error("Failed to subscribe to newsletter");
  // }
}
