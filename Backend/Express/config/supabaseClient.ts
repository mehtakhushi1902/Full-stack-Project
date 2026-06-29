import { createClient } from "@supabase/supabase-js";

const supabase = (token?: string) => {
    return createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!,
        {
            global: {
                headers: token
                    ? {
                        Authorization: `Bearer ${token}`,
                    }
                    : {},
            },
        }
    );
};

export default supabase;