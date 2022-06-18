import { render } from "@testing-library/react";
import { mocked } from "jest-mock";
import { useSession } from "next-auth/react";
import { SignInButton } from ".";

jest.mock("next-auth/react");

describe("SignInButton Component", () => {
  it("Renders correctly when user is not authenticated", () => {
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: "loading"
    });

    const { getByText } = render(
      <SignInButton />
    );

    expect(getByText("Sign in with Github")).toBeInTheDocument();
  });

  it("Renders correctly when user is authenticated", () => {
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce({
      data: {
        user: {
          name: "John Doe",
          email: "johndoe@example.com",
        },
        expires: "fake-expires"
      },
      status: "authenticated"
    });

    const { getByText } = render(
      <SignInButton />
    );

    expect(getByText("John Doe")).toBeInTheDocument();
  });
})