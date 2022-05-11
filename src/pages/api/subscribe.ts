import { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "../../services/stripe";
import { getSession } from "next-auth/react";

export default async function subscribe(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === "POST") {
    const session = await getSession({ req: request });

    const stripeCustomer = await stripe.customers.create({
      email: session.user.email,
      // metadata
    })

    const stripeChekoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomer.id,
      payment_method_types: ["card"],
      billing_address_collection: "required",
      line_items: [
        {
          price: "price_1KxdnUKNgs3FAsVxbXnPnxEQ",
          quantity: 1
        }
      ],
      mode: "subscription",
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL
    });

    return response.status(200).json({ session_id: stripeChekoutSession.id })
  } else {
    response.setHeader("Allow", "POST");
    response.status(405).end("Method not allowed");
  }
}