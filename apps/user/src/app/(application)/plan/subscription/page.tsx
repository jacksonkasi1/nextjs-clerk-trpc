"use client";
import { Title } from "rizzui";

import {api } from "../../../../trpc/react";

export default function Home() {

  const { isLoading, data } = api.post.getUsers.useQuery();

  return (
    <>
      <Title>Coming soon...</Title>
      {
        isLoading ? <p>loading...</p> : <pre>{JSON.stringify(data, null, 2)}</pre>
      }
    </>
  );
}
