@echo off

echo ============================
echo INSTALANDO SUPABASE
echo ============================

npm install @supabase/supabase-js

echo ============================
echo CREANDO CARPETAS
echo ============================

mkdir src\lib

echo ============================
echo CREANDO supabase.ts
echo ============================

(
echo import { createClient } from "@supabase/supabase-js";
echo.
echo const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
echo const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
echo.
echo export const supabase = createClient(
echo   supabaseUrl,
echo   supabaseKey
echo );
) > src\lib\supabase.ts

echo ============================
echo CREANDO .env.local
echo ============================

(
echo NEXT_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
echo NEXT_PUBLIC_SUPABASE_ANON_KEY=TU-KEY
) > .env.local

echo ============================
echo TODO LISTO
echo ============================

pause