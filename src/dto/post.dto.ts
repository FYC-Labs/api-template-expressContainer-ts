import { Post } from "../generated/prisma/client";

export function renderOne(post: Post) {
  return {
    id: post.uuid,
    title: post.title,
    description: post.description,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  }
}
