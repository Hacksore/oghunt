"use server";

import { EmailSource } from "@prisma/client";
import prisma from "../db";
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

  // TOOD: send them an email via SES
}
