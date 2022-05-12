import { query as q } from "faunadb";
import { fauna } from "../../../services/faunadb";
import { stripe } from "../../../services/stripe";

export async function saveSubscription(
  subscription_id: string,
  customer_id: string,
  createAction = false
) {
  const userRef = await fauna.query(
    q.Select(
      "ref",
      q.Get(
        q.Match(
          q.Index("user_by_stripe_customer_id"),
          customer_id
        )
      )
    )
  );

  const subscription = await stripe.subscriptions.retrieve(subscription_id);

  const subscriptionData = {
    id: subscription.id,
    user_id: userRef,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
  };

  if (createAction) {
    await fauna.query(
      q.Create(
        q.Collection("subscriptions"),
        {
          data: subscriptionData
        }
      )
    );
  } else {
    await fauna.query(
      q.Replace(
        q.Select(
          "ref",
          q.Get(
            q.Match(
              q.Index("subscription_by_id"),
              subscription_id
            )
          )
        ),
        { data: subscriptionData }
      )
    );
  }
}