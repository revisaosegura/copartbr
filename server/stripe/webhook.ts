import { Request, Response } from "express";
import Stripe from "stripe";
import { getDb } from "../db";
import { payments, users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

// Stripe é opcional - apenas inicializa se a chave estiver configurada
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-10-29.clover",
    })
  : null;

export async function handleStripeWebhook(req: Request, res: Response) {
  // Verificar se Stripe está configurado
  if (!stripe) {
    console.warn("[Webhook] Stripe não configurado - STRIPE_SECRET_KEY ausente");
    return res.status(503).send("Stripe not configured");
  }

  const sig = req.headers["stripe-signature"];

  if (!sig) {
    console.error("[Webhook] No signature found");
    return res.status(400).send("No signature");
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("[Webhook] Signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(`[Webhook] Received event: ${event.type} (${event.id})`);

  // Handle test events
  if (event.id.startsWith("evt_test_")) {
    console.log("[Webhook] Test event detected, returning verification response");
    return res.json({
      verified: true,
    });
  }

  const db = await getDb();
  if (!db) {
    console.error("[Webhook] Database not available");
    return res.status(500).send("Database error");
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("[Webhook] Checkout session completed:", session.id);

        // Extract metadata
        const userId = session.metadata?.user_id;
        const vehicleId = session.metadata?.vehicle_id;
        const paymentType = session.metadata?.payment_type as "deposit" | "bid" | "purchase";

        if (!userId) {
          console.error("[Webhook] No user_id in metadata");
          break;
        }

        // Save Stripe Customer ID if not already saved
        if (session.customer) {
          await db
            .update(users)
            .set({ stripeCustomerId: session.customer as string })
            .where(eq(users.id, parseInt(userId)));
        }

        // Create payment record
        await db.insert(payments).values({
          userId: parseInt(userId),
          vehicleId: vehicleId ? parseInt(vehicleId) : null,
          stripeCheckoutSessionId: session.id,
          stripePaymentIntentId: session.payment_intent as string,
          amount: session.amount_total || 0,
          currency: session.currency || "BRL",
          status: "completed",
          type: paymentType || "deposit",
          metadata: JSON.stringify(session.metadata),
        });

        console.log("[Webhook] Payment record created for user:", userId);
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("[Webhook] Payment intent succeeded:", paymentIntent.id);

        // Update payment status if exists
        const result = await db
          .update(payments)
          .set({ status: "completed" })
          .where(eq(payments.stripePaymentIntentId, paymentIntent.id));

        console.log("[Webhook] Updated payment status:", result);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("[Webhook] Payment intent failed:", paymentIntent.id);

        // Update payment status
        await db
          .update(payments)
          .set({ status: "failed" })
          .where(eq(payments.stripePaymentIntentId, paymentIntent.id));
        break;
      }

      case "customer.created": {
        const customer = event.data.object as Stripe.Customer;
        console.log("[Webhook] Customer created:", customer.id);
        // Customer ID is already saved in checkout.session.completed
        break;
      }

      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("[Webhook] Error processing event:", error);
    res.status(500).send("Webhook processing error");
  }
}
