# exportar_proyecto.ps1
$outputFile = "proyecto_exportado.txt"
$files = @(
    "src/app/BookingCalendar.tsx",
    "src/app/page.tsx",
    "src/app/globals.css",
    "src/app/layout.tsx",
    "lib/supabase.ts",
    "tailwind.config.js",
    "postcss.config.js"
    # "src/app/admin/page.tsx",   # cuando exista
    # "src/app/cancelar/page.tsx" # cuando exista
)

# Crear o sobrescribir archivo de salida
"=== EXPORTACIÓN DE CÓDIGO DEL PROYECTO (excluye Copias) ===" | Out-File -FilePath $outputFile -Encoding utf8
"Fecha: $(Get-Date)" | Add-Content $outputFile
"" | Add-Content $outputFile

foreach ($file in $files) {
    if (Test-Path $file) {
        # Verificar que el nombre del archivo no contenga "Copia"
        $filename = Split-Path $file -Leaf
        if ($filename -notlike "*Copia*") {
            "----- INICIO: $file -----" | Add-Content $outputFile
            Get-Content $file -Raw | Add-Content $outputFile
            "----- FIN: $file -----`n" | Add-Content $outputFile
        } else {
            "----- $file omitido por contener 'Copia' -----`n" | Add-Content $outputFile
        }
    } else {
        # Opcional: no escribir nada para archivos que no existen
        # "----- Archivo no encontrado: $file -----`n" | Add-Content $outputFile
    }
}

Write-Host "Exportación completada. Archivo generado: $outputFile"