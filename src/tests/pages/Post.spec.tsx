import { render, screen } from "@testing-library/react";
import { mocked } from "jest-mock";
import { getSession } from "next-auth/react";
import Post, { getServerSideProps } from "../../pages/posts/[slug]";
import { getPrismicClient } from "../../services/prismic";

const post = {
  slug: "Slug Fake",
  title: "Title Fake",
  content: "<p>Excerpt Fake</p>",
  updated_at: "10 de Junho",
};

jest.mock("../../services/prismic");
jest.mock("next-auth/react");

describe("Post Page", () => {
  it("Renders Correctly", () => {
    render(
      <Post post={post} />
    );

    expect(screen.getByText("Title Fake")).toBeInTheDocument();
    expect(screen.getByText("Excerpt Fake")).toBeInTheDocument();
  });

  it("Redirects user if no subscription found", async () => {
    const getSessionMocked = mocked(getSession);

    getSessionMocked.mockResolvedValueOnce(null)

    const response = await getServerSideProps({
      params: {
        slug: "my-new-post"
      }
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: "/",
        })
      })
    );
  });

  it("Loads initial data", async () => {
    const getSessionMocked = mocked(getSession);
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

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: "Fake Active"
    } as any);

    const response = await getServerSideProps({
      params: {
        slug: "my-new-post"
      }
    } as any);

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
  })
})