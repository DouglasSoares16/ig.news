import { render, screen } from "@testing-library/react";
import { mocked } from "jest-mock";
import Home, { getStaticProps } from "../../pages";
import { stripe } from "../../services/stripe";

jest.mock("next/router");
jest.mock("next-auth/react", () => {
  return {
    useSession() {
      return [null, false];
    }
  }
});
jest.mock("../../services/stripe");

describe("Home Page", () => {
  it("Renders Correctly", () => {
    render(
      <Home product={{ priceId:"fake-id", amount: "R$ 5.90" }} />
    );

    expect(screen.getByText("for R$ 5.90 month")).toBeInTheDocument();
  });

  it("Loads initial data", async () => {
    const retrieveStripePricesMocked = mocked(stripe.prices.retrieve);

    retrieveStripePricesMocked.mockResolvedValueOnce({
      id: "fake-id",
      unit_amount: 1000
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: "fake-id",
            amount: "$10.00"
          }
        }
      })
    );
  })
})