import Head from "next/head";
import styles from "./styles.module.scss";

export default function Posts() {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          <a href="#">
            <time>12 de maio de 2022</time>
            <strong>Creating a Monorepo with Lerna & Yarn Workspaces</strong>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit esse maiores ut explicabo culpa reiciendis cupiditate quam repellendus voluptates.</p>
          </a>

          <a href="#">
            <time>12 de maio de 2022</time>
            <strong>Creating a Monorepo with Lerna & Yarn Workspaces</strong>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit esse maiores ut explicabo culpa reiciendis cupiditate quam repellendus voluptates.</p>
          </a>

          <a href="#">
            <time>12 de maio de 2022</time>
            <strong>Creating a Monorepo with Lerna & Yarn Workspaces</strong>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit esse maiores ut explicabo culpa reiciendis cupiditate quam repellendus voluptates.</p>
          </a>
        </div>
      </main>
    </>
  );
}