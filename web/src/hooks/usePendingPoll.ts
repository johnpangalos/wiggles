import { useEffect, useRef } from "react";
import { NewPost } from "@/types";
import { getAuthHeaders } from "@/utils";

const INITIAL_DELAY = 1000;
const MAX_DELAY = 8000;
const BACKOFF_FACTOR = 2;

async function fetchPost(orderKey: string): Promise<NewPost | null> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${import.meta.env.VITE_API_URL}/posts/${orderKey}`, {
    headers,
  });
  if (!res.ok) return null;
  return res.json();
}

/**
 * Polls individual pending posts with exponential backoff.
 *
 * When any post in `posts` has `pending: true`, this hook fetches each
 * pending post individually via GET /api/posts/:orderKey (1s → 2s → 4s → 8s)
 * until all posts are resolved.
 */
export function usePendingPoll(
  posts: NewPost[],
  onUpdate: (updater: (prev: NewPost[]) => NewPost[]) => void,
) {
  const delayRef = useRef(INITIAL_DELAY);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const pendingPosts = posts.filter((p) => p.pending);
    if (pendingPosts.length === 0) {
      delayRef.current = INITIAL_DELAY;
      return;
    }

    timerRef.current = setTimeout(async () => {
      try {
        const results = await Promise.all(
          pendingPosts.map((p) => fetchPost(p.orderKey)),
        );

        const updated = new Map<string, NewPost>();
        for (const post of results) {
          if (post) updated.set(post.orderKey, post);
        }

        if (updated.size > 0) {
          onUpdate((prev) => prev.map((p) => updated.get(p.orderKey) ?? p));
        }

        const stillPending = results.some((p) => p?.pending);
        if (stillPending) {
          delayRef.current = Math.min(
            delayRef.current * BACKOFF_FACTOR,
            MAX_DELAY,
          );
        } else {
          delayRef.current = INITIAL_DELAY;
        }
      } catch {
        delayRef.current = Math.min(
          delayRef.current * BACKOFF_FACTOR,
          MAX_DELAY,
        );
      }
    }, delayRef.current);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [posts, onUpdate]);
}
