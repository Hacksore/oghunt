"use server";

import { NextResponse } from "next/server";
import env from "../env";
export async function subscribeToNewsletter(email: string) {
  return NextResponse.json(
    {
      message: "Skill issue: Newsletter subscription is disabled in production mode.",
    },
    { status: 200 },
  );

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
