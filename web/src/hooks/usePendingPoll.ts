import { useEffect, useRef } from "react";
import { NewPost } from "@/types";

const INITIAL_DELAY = 1000;
const MAX_DELAY = 8000;
const BACKOFF_FACTOR = 2;

/**
 * Polls for pending posts with exponential backoff.
 *
 * When any post in `posts` has `pending: true`, this hook calls `refetch`
 * repeatedly (1s → 2s → 4s → 8s) until all posts are resolved.
 */
export function usePendingPoll(
  posts: NewPost[],
  refetch: () => Promise<NewPost[]>,
  onUpdate: (posts: NewPost[], cursor?: string) => void,
) {
  const delayRef = useRef(INITIAL_DELAY);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const hasPending = posts.some((p) => p.pending);
    if (!hasPending) {
      delayRef.current = INITIAL_DELAY;
      return;
    }

    timerRef.current = setTimeout(async () => {
      try {
        const fresh = await refetch();
        const stillPending = fresh.some((p) => p.pending);

        onUpdate(fresh);

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
  }, [posts, refetch, onUpdate]);
}
