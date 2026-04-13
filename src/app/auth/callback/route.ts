import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  // #region agent log
  fetch('http://127.0.0.1:7529/ingest/27623fb8-b785-4a8e-aae2-c7f03373464e',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'d0bfe1'},body:JSON.stringify({sessionId:'d0bfe1',runId:'pre-fix',hypothesisId:'H2',location:'src/app/auth/callback/route.ts:GET',message:'Auth callback hit',data:{hasCode:!!code,codeLen:code?code.length:0,next,origin,fullPath:new URL(request.url).pathname},timestamp:Date.now()})}).catch(()=>{});
  // #endregion

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // #region agent log
      fetch('http://127.0.0.1:7529/ingest/27623fb8-b785-4a8e-aae2-c7f03373464e',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'d0bfe1'},body:JSON.stringify({sessionId:'d0bfe1',runId:'pre-fix',hypothesisId:'H3',location:'src/app/auth/callback/route.ts:GET',message:'exchangeCodeForSession succeeded; redirecting',data:{redirectTarget:`${origin}${next}`},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      return NextResponse.redirect(`${origin}${next}`);
    }
    // #region agent log
    fetch('http://127.0.0.1:7529/ingest/27623fb8-b785-4a8e-aae2-c7f03373464e',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'d0bfe1'},body:JSON.stringify({sessionId:'d0bfe1',runId:'pre-fix',hypothesisId:'H3',location:'src/app/auth/callback/route.ts:GET',message:'exchangeCodeForSession failed',data:{errorMessage:error?.message ?? 'unknown'},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
  }

  // #region agent log
  fetch('http://127.0.0.1:7529/ingest/27623fb8-b785-4a8e-aae2-c7f03373464e',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'d0bfe1'},body:JSON.stringify({sessionId:'d0bfe1',runId:'pre-fix',hypothesisId:'H3',location:'src/app/auth/callback/route.ts:GET',message:'No code present; redirecting to login with auth_failed',data:{redirectTarget:`${origin}/auth/login?error=auth_failed`},timestamp:Date.now()})}).catch(()=>{});
  // #endregion
  return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`);
}
