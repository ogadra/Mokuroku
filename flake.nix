{
  description = "Mokuroku - Speaking schedule website";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };

  outputs = { self, nixpkgs }:
    let
      systems = [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ];
      forAllSystems = nixpkgs.lib.genAttrs systems;
    in
    {
      packages = forAllSystems (system:
        let
          pkgs = import nixpkgs {
            inherit system;
            config.allowUnfree = true;
          };
        in
        {
          chrome-devtools-mcp = pkgs.writeShellScriptBin "chrome-devtools-mcp" ''
            exec ${pkgs.pnpm}/bin/pnpm dlx chrome-devtools-mcp@latest -e ${pkgs.google-chrome}/bin/google-chrome-stable "$@"
          '';
        }
      );

      devShells = forAllSystems (system:
        let
          pkgs = import nixpkgs {
            inherit system;
            config.allowUnfree = true;
          };

          # nixpkgs does not package @playwright/cli, and fetching it with npx at run time leaves it outside the flake, so build it from the upstream source.
          playwright-cli = pkgs.buildNpmPackage rec {
            pname = "playwright-cli";
            version = "0.1.22";

            src = pkgs.fetchFromGitHub {
              owner = "microsoft";
              repo = "playwright-cli";
              rev = "v${version}";
              hash = "sha256-80xzHvf7BHGvoKvMdkGeNUsUrpZrpw5eryuQM8NKT/E=";
            };

            npmDepsHash = "sha256-mGD7a/v1cx/xPGZo8nN3WA40mYGgF/KzMKiGbvUeX4E=";
            dontNpmBuild = true;

            meta.mainProgram = "playwright-cli";
          };
        in
        {
          default = pkgs.mkShell {
            buildInputs = with pkgs; [
              nodejs_24
              pnpm
              lefthook
              playwright-cli
            ];

            # Browsers that Playwright downloads cannot run on NixOS, and the revisions in playwright-driver.browsers do not match the ones playwright-cli expects, so point it at the nixpkgs Chromium binary directly.
            PLAYWRIGHT_MCP_BROWSER = "chromium";
            PLAYWRIGHT_MCP_EXECUTABLE_PATH = pkgs.lib.getExe pkgs.chromium;
          };
        }
      );
    };
}
