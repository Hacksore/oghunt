import { getTodaysLaunches } from "./lib/persistence";

export interface PostResponse {
  data: {
    posts: {
      nodes: Post[];
      pageInfo: PageInfo;
      totalCount: number;
    };
  };
}

export interface Post {
  id: string;
  name: string;
  url: string;
  tagline: string;
  description: string;
  createdAt: string;
  topics: Topic;
  votesCount: number;
}

export interface Topic {
  nodes: Node[];
}

export interface Node {
  id: string;
  description: string;
  name: string;
}

export interface PageInfo {
  hasNextPage: boolean;
  endCursor: string | undefined;
}

export type ProductPost = NonNullable<Awaited<ReturnType<typeof getTodaysLaunches>>>[0];
