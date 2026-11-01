"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Studio } from "@/types";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastProvider";
import { apiRequest } from "@/lib/api";

interface BookmarkContextType {
  bookmarks: string[];
  isBookmarked: (idOrSlug: string) => boolean;
  toggleBookmark: (studioOrId: Studio | string) => Promise<boolean>;
  loading: boolean;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export function BookmarkProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // User-specific persistent key
  const storageKey = user?.id
    ? `studiospace_bookmarks_${user.id}`
    : user?.email
    ? `studiospace_bookmarks_${user.email}`
    : "studiospace_bookmarks_guest";

  // Load bookmarks on user change / mount
  useEffect(() => {
    let localBookmarked: string[] = [];
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        localBookmarked = JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Failed to read bookmarks from localStorage:", e);
    }

    setBookmarks(localBookmarked);
    setLoading(false);

    // If authenticated, sync with server
    if (isAuthenticated) {
      apiRequest<{ studioIds: string[] }>("/bookmarks")
        .then((res) => {
          if (res?.studioIds && Array.isArray(res.studioIds)) {
            // Merge local and remote
            const combined = Array.from(new Set([...localBookmarked, ...res.studioIds]));
            setBookmarks(combined);
            localStorage.setItem(storageKey, JSON.stringify(combined));
          }
        })
        .catch(() => {
          // Graceful fallback to user-specific localStorage
        });
    }
  }, [user?.id, user?.email, isAuthenticated, storageKey]);

  const isBookmarked = useCallback(
    (idOrSlug: string): boolean => {
      if (!idOrSlug) return false;
      return bookmarks.includes(idOrSlug);
    },
    [bookmarks]
  );

  const toggleBookmark = useCallback(
    async (studioOrId: Studio | string): Promise<boolean> => {
      const studioId =
        typeof studioOrId === "string"
          ? studioOrId
          : studioOrId._id || studioOrId.id || studioOrId.slug;

      const studioTitle =
        typeof studioOrId === "string" ? "Studio" : studioOrId.title || "Studio";

      const currentlyBookmarked = bookmarks.includes(studioId);
      const nextBookmarks = currentlyBookmarked
        ? bookmarks.filter((id) => id !== studioId)
        : [...bookmarks, studioId];

      // Optimistic update & localStorage persistence
      setBookmarks(nextBookmarks);
      try {
        localStorage.setItem(storageKey, JSON.stringify(nextBookmarks));
      } catch (err) {
        console.warn("Error saving bookmark to localStorage:", err);
      }

      // Show toast
      if (!currentlyBookmarked) {
        toast("success", "Studio Bookmarked", `Saved "${studioTitle}" to your creator collection.`);
      } else {
        toast("info", "Bookmark Removed", `Removed "${studioTitle}" from saved studios.`);
      }

      // Sync with server if authenticated
      if (isAuthenticated) {
        try {
          if (!currentlyBookmarked) {
            await apiRequest(`/bookmarks/${studioId}`, { method: "POST" });
          } else {
            await apiRequest(`/bookmarks/${studioId}`, { method: "DELETE" });
          }
        } catch {
          // Local persistent state remains intact
        }
      }

      return !currentlyBookmarked;
    },
    [bookmarks, storageKey, isAuthenticated, toast]
  );

  return (
    <BookmarkContext.Provider value={{ bookmarks, isBookmarked, toggleBookmark, loading }}>
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error("useBookmarks must be used within a BookmarkProvider");
  }
  return context;
}
