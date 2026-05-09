import { createBrowserClient } from "@supabase/ssr";

// NOTE: Google OAuth provider must be enabled manually in the Supabase Dashboard:
// https://supabase.com/dashboard/project/ynpkjsfnapbhwjmkrfzc/auth/providers
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Server client factory — used in Server Components
export async function createServerSupabaseClient() {
  const { createServerClient } = await import("@supabase/ssr");
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component — cookie mutations are handled by middleware
          }
        },
      },
    }
  );
}
