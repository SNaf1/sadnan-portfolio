import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@portfolio/db";
import { randomUUID } from "crypto";
import { ContactSubmitRequest } from "@portfolio/types";

export async function POST(request: NextRequest) {
  try {
    const body: ContactSubmitRequest = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Retrieve visitor & session cookies
    let visitorId = request.cookies.get("portfolio_visitor_id")?.value;
    let sessionId = request.cookies.get("portfolio_session_id")?.value;

    // Fallback: If cookies are missing (blocked), create temporary ones on the fly
    if (!visitorId) {
      visitorId = randomUUID();
      await prisma.visitor.create({
        data: {
          id: visitorId,
          firstTouchSource: "cookie-blocked",
          firstTouchMedium: "unknown",
          firstTouchUrl: "unknown",
        },
      });
    }

    if (!sessionId) {
      sessionId = randomUUID();
      await prisma.session.create({
        data: {
          id: sessionId,
          visitorId: visitorId,
          lastTouchSource: "cookie-blocked",
          lastTouchMedium: "unknown",
          landingPage: "unknown",
        },
      });
    }

    // 2. Save the message to Postgres
    const submission = await prisma.contactSubmission.create({
      data: {
        name,
        email,
        message,
        visitorId,
        sessionId,
      },
    });

    // 3. Dispatch Notification Email Directly (Using Resend API if key is provided)
    console.log(`[Email Dispatcher] Dispatching email to sadnan.ornob@gmail.com for submission ${submission.id}...`);
    try {
      await dispatchEmailViaResend({ name, email, message });
      console.log(`[Email Dispatcher] Email dispatched successfully.`);
    } catch (emailError: any) {
      console.error("[Email Dispatcher] Failed to send email notification:", emailError.message || emailError);
    }

    return NextResponse.json({
      success: true,
      message: "Message received successfully!",
    });
  } catch (error) {
    console.error("Error handling contact submission:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Actual Resend API Integration (Direct sending)
async function dispatchEmailViaResend(data: { name: string; email: string; message: string }) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn("[Email Dispatcher] Warning: RESEND_API_KEY is missing in your .env file. Email was printed to terminal instead.");
    console.log(`[Simulated Email Output]
      To: sadnan.ornob@gmail.com
      From: onboarding@resend.dev
      Subject: [Portfolio Contact] Message from ${data.name}
      ---
      Name: ${data.name}
      Email: ${data.email}
      Message: ${data.message}
    `);
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: "sadnan.ornob@gmail.com",
      subject: `[Portfolio Contact] New message from ${data.name}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #1c1917; max-width: 600px; border: 1px solid #e7e5e4; border-radius: 12px;">
          <h2 style="font-size: 20px; font-weight: 800; text-transform: uppercase; margin-bottom: 20px; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
            New Contact Form Message
          </h2>
          <p style="margin: 10px 0;"><strong>Name:</strong> ${data.name}</p>
          <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
          <div style="margin-top: 20px; padding: 15px; background-color: #f5f5f4; border-radius: 8px;">
            <p style="margin: 0; white-space: pre-wrap; font-style: italic;">"${data.message}"</p>
          </div>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e7e5e4;" />
          <p style="font-size: 11px; color: #a8a29e; margin: 0;">Sent automatically by your Next.js portfolio backend.</p>
        </div>
      `,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Resend API failed: ${res.status} - ${errorText}`);
  }
}
