import { render, fireEvent } from "@testing-library/react";
import { mocked } from "jest-mock";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { SubscribeButton } from ".";

jest.mock("next-auth/react");

jest.mock("next/router");

describe("SubscribeButton Component", () => {
  it("Renders correctly", () => {
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: "loading"
    });

    const { getByText } = render(
      <SubscribeButton />
    );

    expect(getByText("Subscribe Now")).toBeInTheDocument();
  });

  it("Redirects user to sign in when not authenticated", () => {
    const useSessionMocked = mocked(useSession);
    const signInMocked = mocked(signIn);

    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: "loading"
    });
    

    const { getByText } = render(
      <SubscribeButton />
    );

    const subsButton = getByText("Subscribe Now");

    fireEvent.click(subsButton);

    expect(signInMocked).toHaveBeenCalled();
  });

  it("Redirects to posts when user already has a subscription", () => {
    const useRouterMocked = mocked(useRouter);
    const useSessionMocked = mocked(useSession);

    const pushMock = jest.fn();

    useSessionMocked.mockReturnValueOnce({
      data: {
        user: {
          name: "John Doe",
          email: "johndoe@example.com",
        },
        activeSubscription: "fake-subscription",
        expires: "fake-expires"
      },
      status: "authenticated"
    })

    useRouterMocked.mockReturnValueOnce({
      push: pushMock
    } as any);

    const { getByText } = render(
      <SubscribeButton />
    );

    const subsButton = getByText("Subscribe Now");

    fireEvent.click(subsButton);

    expect(pushMock).toHaveBeenCalledWith("/posts");
  })
})