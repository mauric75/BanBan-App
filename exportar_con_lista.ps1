$outFile = "proyecto_seguro.txt"
$excludedLog = "archivos_excluidos.txt"

"=== PROYECTO BANBAN - EXPORTACIÓN SEGURA ===" | Out-File $outFile -Encoding utf8
"Fecha: $(Get-Date)" | Add-Content $outFile
"" | Add-Content $outFile

"=== ARCHIVOS EXCLUIDOS (solo listado) ===" | Out-File $excludedLog -Encoding utf8
"Fecha: $(Get-Date)" | Add-Content $excludedLog
"Motivos: nombre contiene palabra reservada | carpeta excluida | extensión no relevante" | Add-Content $excludedLog
"" | Add-Content $excludedLog

$dirs = @("src", "lib")
$excludeNames = @("copia", "supabase", ".env", "secret", "key", "token", "password", "credential")

foreach ($dir in $dirs) {
    if (Test-Path $dir) {
        $allFiles = Get-ChildItem -Path $dir -Recurse -File
        foreach ($file in $allFiles) {
            $exclude = $false
            $reason = ""
            
            # 1. Exclusión por nombre
            foreach ($ex in $excludeNames) {
                if ($file.Name -like "*$ex*") {
                    $exclude = $true
                    $reason = "nombre contiene '$ex'"
                    break
                }
            }
            
            # 2. Exclusión por carpeta (node_modules, .next, .git)
            if (-not $exclude -and ($file.FullName -match "\\node_modules\\" -or $file.FullName -match "\\.next\\" -or $file.FullName -match "\\.git\\")) {
                $exclude = $true
                $reason = "carpeta excluida"
            }
            
            # 3. Exclusión por extensión (solo permitimos ciertas extensiones)
            if (-not $exclude -and ($file.Extension -notmatch "\.(tsx?|jsx?|css|json|html)$")) {
                $exclude = $true
                $reason = "extensión no relevante ($($file.Extension))"
            }
            
            $relPath = $file.FullName.Replace((Get-Location).Path + '\', '')
            
            if ($exclude) {
                "$relPath - ($reason)" | Add-Content $excludedLog
            } else {
                "----- INICIO: $relPath -----" | Add-Content $outFile
                Get-Content $file.FullName -Raw | Add-Content $outFile
                "----- FIN -----`n" | Add-Content $outFile
            }
        }
    }
}

Write-Host "Exportación completada."
Write-Host "Archivo con contenido permitido: $outFile"
Write-Host "Archivo con lista de excluidos: $excludedLog"