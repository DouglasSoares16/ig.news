import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { query as q } from "faunadb";
import { stripe } from "../../services/stripe";
import { fauna } from "../../services/faunadb";

type User = {
  ref: {
    id: string;
  },
  data: {
    stripe_customer_id: string;
  }
};

export default async function subscribe(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === "POST") {
    const session = await getSession({ req: request });

    const user = await fauna.query<User>(
      q.Get(
        q.Match(
          q.Index("user_by_email"),
          q.Casefold(session.user.email)
        )
      )
    );

    let customer_id = user.data.stripe_customer_id;

    if (!customer_id) {
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email,
        // metadata
      });
  
      await fauna.query(
        q.Update(
          q.Ref(
            q.Collection("users"),
            user.ref.id
          ),
          {
            data: {
              stripe_customer_id: stripeCustomer.id
            }
          }
        )
      );

      customer_id = stripeCustomer.id;
    }

    const stripeChekoutSession = await stripe.checkout.sessions.create({
      customer: customer_id,
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