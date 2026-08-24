import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: 'Missing Supabase credentials' });
  }

  try {
    // 실제 테이블을 조회해서 DB까지 요청이 닿도록 함 (프로젝트 활성 상태 유지)
    // 주의: /rest/v1/ 루트는 service_role 키만 허용하므로 anon 키로는 401이 나고
    // DB에 도달하지 않아 활동으로 집계되지 않는다
    const response = await fetch(`${supabaseUrl}/rest/v1/groups?select=id&limit=1`, {
      method: 'GET',
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    });

    if (response.ok) {
      return res.status(200).json({
        success: true,
        message: 'Supabase pinged successfully',
        timestamp: new Date().toISOString(),
      });
    } else {
      return res.status(response.status).json({
        success: false,
        error: `Supabase responded with status ${response.status}`,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
