$ErrorActionPreference = "Stop"

$nodeCandidates = @(
  "node",
  "$HOME\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
)

$node = $null
foreach ($candidate in $nodeCandidates) {
  try {
    $resolved = Get-Command $candidate -ErrorAction Stop
    $node = $resolved.Source
    break
  } catch {
  }
}

if (-not $node) {
  throw "Node.js was not found. Install Node.js or run this from Codex with the bundled runtime available."
}

& $node "$PSScriptRoot\server.mjs"
