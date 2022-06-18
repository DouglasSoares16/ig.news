import { render, screen } from "@testing-library/react";
import { mocked } from "jest-mock";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Post, { getStaticProps } from "../../pages/posts/preview/[slug]";
import { getPrismicClient } from "../../services/prismic";

const post = {
  slug: "Slug-Fake",
  title: "Title Fake",
  content: "<p>Excerpt Fake</p>",
  updated_at: "10 de Junho",
};

jest.mock("../../services/prismic");
jest.mock("next-auth/react");
jest.mock("next/router");

describe("Post Preview Page", () => {
  it("Renders Correctly", () => {
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: "loading"
    });

    render(
      <Post post={post} />
    );

    expect(screen.getByText("Title Fake")).toBeInTheDocument();
    expect(screen.getByText("Excerpt Fake")).toBeInTheDocument();
    expect(screen.getByText("Wanna continue reading?")).toBeInTheDocument();
  });

  it("Redirects user to full post when user is subscribed", async () => {
    const useSessionMocked = mocked(useSession);
    const useRouterMocked = mocked(useRouter);

    const pushMock = jest.fn();

    useSessionMocked.mockReturnValueOnce({
      data: {
        activeSubscription: 'fake-active-subscription',
        expires: null
      },
      status: 'authenticated'
    } as any);

    useRouterMocked.mockReturnValueOnce({
      push: pushMock
    } as any);

    render(
      <Post post={post} />
    );

    expect(pushMock).toHaveBeenCalledWith("/posts/Slug-Fake");
  });

  it("Loads initial data", async () => {
      const getPrismicClientMocked = mocked(getPrismicClient);
  
      getPrismicClientMocked.mockReturnValueOnce({
        getByUID: jest.fn().mockResolvedValueOnce({
          data: {
            title: [
              { type: "heading", text: "My new post" },
            ],
            content: [
              { type: "paragraph", text: "Post content" }
            ]
          },
          last_publication_date: "04-01-2022"
        })
      } as any);
  
      const response = await getStaticProps({
        params: {
          slug: "my-new-post"
        }
      });
  
      expect(response).toEqual(
        expect.objectContaining({
          props: {
            post: {
              slug: "my-new-post",
              title: "My new post",
              content: "<p>Post content</p>",
              updated_at: "01 de abril de 2022"
            }
          }
        })
      );
    });
})