$ErrorActionPreference = 'Stop'

$paths = @(
  '.\dist\Markdown Viewer Setup 1.0.8.exe',
  '.\dist\win-unpacked\Markdown Viewer.exe'
)

$results = foreach ($p in $paths) {
  if (Test-Path $p) {
    $sig = Get-AuthenticodeSignature -FilePath $p
    [PSCustomObject]@{
      File       = $p
      Status     = $sig.Status
      Subject    = $sig.SignerCertificate.Subject
      Thumbprint = $sig.SignerCertificate.Thumbprint
    }
  } else {
    [PSCustomObject]@{
      File       = $p
      Status     = 'MISSING'
      Subject    = ''
      Thumbprint = ''
    }
  }
}

$results | Format-Table -AutoSize

if ($results.Status -contains 'NotSigned') { throw 'One or more EXE artifacts are NotSigned.' }
